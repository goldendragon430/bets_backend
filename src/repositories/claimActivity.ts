import { BigNumber, ethers } from 'ethers';
import { RewardType } from '../utils/enums';
import ClaimActivity from '../models/claimActivity';

class ClaimActivityRepository {
    constructor() { }

    getLeaderboard = async () => {
        const abpActivities = await ClaimActivity.aggregate(
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

        const ethActivites = await ClaimActivity.aggregate(
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

    getClaimActivity = async (txHash: string) => {
        return ClaimActivity.findOne({ transactionHash: txHash });
    }

    addClaimActivity = async (
        battleId: number,
        user: string,
        amount: BigNumber,
        rewardType: RewardType,
        transactionHash: string,
        blockNumber: number,
    ) => {
        const claimActivityInstance = new ClaimActivity({
            battleId,
            user,
            amount: amount.toString(),
            rewardType,
            amountInDecimal: parseFloat(ethers.utils.formatEther(amount)),
            transactionHash,
            blockNumber,
        });

        return claimActivityInstance.save();
    }

    getTotalETHAmountByAddress = async (address: string) => {
        const activities = await ClaimActivity.aggregate(
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
        const activities = await ClaimActivity.aggregate(
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
        const activities = await ClaimActivity.aggregate(
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
        const activities = await ClaimActivity.aggregate(
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
}

export default new ClaimActivityRepository();
