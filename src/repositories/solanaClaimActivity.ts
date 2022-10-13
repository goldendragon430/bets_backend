import { ethers } from 'ethers';
import { RewardType } from '../utils/enums';
import SolanaClaimActivity from '../models/solanaClaimActivity';
import { BN } from '@project-serum/anchor';

class SolanaClaimActivityRepository {
    constructor() { }

    getLeaderboard = async () => {
        const abpActivities = await SolanaClaimActivity.aggregate(
            [
                {
                    $match: {
                        rewardType: '0'
                    }
                },
                {
                    $group: {
                        _id: {
                            user: '$user',
                        },
                        user: {
                            $first: '$user'
                        },
                        battleId: {
                            $last: '$battleId'
                        },
                        sumA: {
                            $sum: '$amountInDecimal'
                        }
                    }
                },
                { $sort: { sumA: - 1 } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: 'address',
                        as: 'userList',
                    }
                },
                {
                    $unwind: {
                        path: '$userList',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]
        );

        const ethActivites = await SolanaClaimActivity.aggregate(
            [
                {
                    $match: {
                        rewardType: '1'
                    }
                },
                {
                    $group: {
                        _id: {
                            user: '$user',
                        },
                        user: {
                            $first: '$user'
                        },
                        battleId: {
                            $last: '$battleId'
                        },
                        sumA: {
                            $sum: '$amountInDecimal'
                        }
                    }
                },
                { $sort: { sumA: - 1 } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: 'address',
                        as: 'userList',
                    }
                },
                {
                    $unwind: {
                        path: '$userList',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]
        );

        const userLists = [...new Set([...abpActivities.map((item) => item.user), ...ethActivites.map((item) => item.user)])];
        const activities = userLists.map((item) => {
            const abpActivity = abpActivities.find((activity) => activity.user === item);
            const ethActivity = ethActivites.find((activity) => activity.user === item);
            return {
                user: item,
                battleId: abpActivity?.battleId || ethActivity?.battleId,
                abpAmount: abpActivity?.sumA || 0,  // abp
                ethAmount: ethActivity?.sumA || 0,  // eth
                userInfo: abpActivity?.userList,
            };
        });

        return activities.sort((a, b) => {
            return b.abpAmount - a.abpAmount;
        });
    }

    getClaimActivity = async (txHash: string, type: RewardType) => {
        return SolanaClaimActivity.findOne({ transactionHash: txHash, rewardType: type });
    }

    addClaimActivity = async (
        battleId: string,
        user: string,
        amount: BN,
        rewardType: RewardType,
        transactionHash: string,
        blockNumber: number,
    ) => {
        const claimActivityInstance = new SolanaClaimActivity({
            battleId,
            user,
            amount: amount.toString(),
            rewardType,
            amountInDecimal: amount.toNumber() / 10 ** 9,
            transactionHash,
            blockNumber,
        });

        return claimActivityInstance.save();
    }

    getTotalETHAmountByAddress = async (address: string) => {
        const activities = await SolanaClaimActivity.aggregate(
            [
                {
                    $match: {
                        user: address,
                        rewardType: '1'
                    }
                },
                {
                    $group: {
                        _id: {
                            user: '$user',
                        },
                        sumA: {
                            $sum: '$amountInDecimal'
                        }
                    }
                }
            ]
        );

        return activities[0]?.sumA || 0;
    }

    getBattleWonCountByAddress = async (address: string) => {
        const activities = await SolanaClaimActivity.aggregate(
            [
                {
                    $match: {
                        user: address,
                        rewardType: '1'
                    }
                },
                {
                    $group: {
                        _id: {
                            user: '$user',
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]
        );

        return activities[0]?.count || 0;
    }

    getABPRankByAddress = async (address: string) => {
        const activities = await SolanaClaimActivity.aggregate(
            [
                {
                    $match: {
                        rewardType: '0'
                    }
                },
                {
                    $group: {
                        _id: {
                            user: '$user',
                        },
                        user: {
                            $first: '$user'
                        },
                        sumA: {
                            $sum: '$amountInDecimal'
                        }
                    }
                },
                { $sort: { sumA: - 1 } },
            ]
        );

        return activities.findIndex((item) => item.user === address) + 1;
    }

    getWinnerRankByAddress = async (address: string) => {
        const activities = await SolanaClaimActivity.aggregate(
            [
                {
                    $match: {
                        rewardType: '1'
                    }
                },
                {
                    $group: {
                        _id: {
                            user: '$user',
                        },
                        user: {
                            $first: '$user'
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                { $sort: { count: - 1 } },
            ]
        );

        return activities.findIndex((item) => item.user === address) + 1;
    }
}

export default new SolanaClaimActivityRepository();
