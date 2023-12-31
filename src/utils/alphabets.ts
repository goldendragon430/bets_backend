export type Alphabets = {
  'version': '1.10.0',
  'name': 'alphabets',
  'instructions': [
    {
      'name': 'initialize',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'escrowAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'abpMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'abpVault',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'addAdmin',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        }
      ],
      'args': [
        {
          'name': 'admin',
          'type': 'publicKey'
        }
      ]
    },
    {
      'name': 'removeAdmin',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        }
      ],
      'args': [
        {
          'name': 'admin',
          'type': 'publicKey'
        }
      ]
    },
    {
      'name': 'startBattle',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        },
        {
          'name': 'startTime',
          'type': 'u32'
        },
        {
          'name': 'endTime',
          'type': 'u32'
        },
        {
          'name': 'betFee',
          'type': 'u16'
        },
        {
          'name': 'abpAmount',
          'type': 'u64'
        },
        {
          'name': 'teamLProject',
          'type': 'publicKey'
        },
        {
          'name': 'teamRProject',
          'type': 'publicKey'
        }
      ]
    },
    {
      'name': 'determineBattle',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'escrowAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'superAdmin',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        }
      ]
    },
    {
      'name': 'userBet',
      'accounts': [
        {
          'name': 'userAccount',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'escrowAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userBattleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        },
        {
          'name': 'betSide',
          'type': 'bool'
        },
        {
          'name': 'betAmount',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'claimReward',
      'accounts': [
        {
          'name': 'escrowAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userAccount',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userBattleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'abpMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'abpVault',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'abpTo',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        },
        {
          'name': 'nonceAbpVault',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'initIdentifier',
      'accounts': [
        {
          'name': 'identifier',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'payer',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'initPool',
      'accounts': [
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'identifier',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'payer',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'ix',
          'type': {
            'defined': 'InitPoolIx'
          }
        }
      ]
    },
    {
      'name': 'initEntry',
      'accounts': [
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'originalMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'originalMintMetadata',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'payer',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'user',
          'type': 'publicKey'
        },
        {
          'name': 'battleId',
          'type': 'string'
        }
      ]
    },
    {
      'name': 'stake',
      'accounts': [
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'stakeEntryOriginalMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'originalMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userBattleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userOriginalMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        },
        {
          'name': 'amount',
          'type': 'u64'
        },
        {
          'name': 'side',
          'type': 'bool'
        }
      ]
    },
    {
      'name': 'claimReceiptMint',
      'accounts': [
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'originalMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'receiptMint',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakeEntryReceiptMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'userReceiptMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenManagerReceiptMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenManager',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'mintCounter',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'tokenManagerProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'associatedTokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'unstake',
      'accounts': [
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'originalMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakeEntryOriginalMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'userOriginalMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'returnReceiptMint',
      'accounts': [
        {
          'name': 'stakeEntry',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'receiptMint',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenManager',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenManagerTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userReceiptMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'collector',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'tokenManagerProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'closeStakePool',
      'accounts': [
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'authority',
          'isMut': true,
          'isSigner': true
        }
      ],
      'args': []
    },
    {
      'name': 'closeStakeEntry',
      'accounts': [
        {
          'name': 'stakePool',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'authority',
          'isMut': true,
          'isSigner': true
        }
      ],
      'args': []
    }
  ],
  'accounts': [
    {
      'name': 'battleAccount',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'totalLAmount',
            'type': 'u64'
          },
          {
            'name': 'totalRAmount',
            'type': 'u64'
          },
          {
            'name': 'teamLNfts',
            'type': 'u32'
          },
          {
            'name': 'teamRNfts',
            'type': 'u32'
          },
          {
            'name': 'startTime',
            'type': 'u32'
          },
          {
            'name': 'endTime',
            'type': 'u32'
          },
          {
            'name': 'isClose',
            'type': 'bool'
          },
          {
            'name': 'betFee',
            'type': 'u16'
          },
          {
            'name': 'abpAmount',
            'type': 'u64'
          },
          {
            'name': 'winnerResult',
            'type': 'u8'
          },
          {
            'name': 'teamLProject',
            'type': 'publicKey'
          },
          {
            'name': 'teamRProject',
            'type': 'publicKey'
          }
        ]
      }
    },
    {
      'name': 'adminAccount',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'superAdmin',
            'type': 'publicKey'
          },
          {
            'name': 'adminList',
            'type': {
              'vec': 'publicKey'
            }
          }
        ]
      }
    },
    {
      'name': 'userBattleAccount',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'betLAmount',
            'type': 'u64'
          },
          {
            'name': 'betRAmount',
            'type': 'u64'
          },
          {
            'name': 'userLNfts',
            'type': 'u32'
          },
          {
            'name': 'userRNfts',
            'type': 'u32'
          },
          {
            'name': 'isClaim',
            'type': 'bool'
          },
          {
            'name': 'startTime',
            'type': 'u32'
          },
          {
            'name': 'betSide',
            'type': 'bool'
          }
        ]
      }
    },
    {
      'name': 'stakeEntry',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'pool',
            'type': 'publicKey'
          },
          {
            'name': 'amount',
            'type': 'u64'
          },
          {
            'name': 'originalMint',
            'type': 'publicKey'
          },
          {
            'name': 'originalMintClaimed',
            'type': 'bool'
          },
          {
            'name': 'lastStaker',
            'type': 'publicKey'
          },
          {
            'name': 'stakeMintClaimed',
            'type': 'bool'
          },
          {
            'name': 'kind',
            'type': 'u8'
          },
          {
            'name': 'stakeMint',
            'type': {
              'option': 'publicKey'
            }
          },
          {
            'name': 'battleId',
            'type': 'string'
          }
        ]
      }
    },
    {
      'name': 'stakePool',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'identifier',
            'type': 'u64'
          },
          {
            'name': 'authority',
            'type': 'publicKey'
          },
          {
            'name': 'resetOnStake',
            'type': 'bool'
          },
          {
            'name': 'totalStaked',
            'type': 'u32'
          }
        ]
      }
    },
    {
      'name': 'stakeAuthorizationRecord',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'pool',
            'type': 'publicKey'
          },
          {
            'name': 'mint',
            'type': 'publicKey'
          }
        ]
      }
    },
    {
      'name': 'identifier',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'count',
            'type': 'u64'
          }
        ]
      }
    }
  ],
  'types': [
    {
      'name': 'InitPoolIx',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'authority',
            'type': 'publicKey'
          }
        ]
      }
    },
    {
      'name': 'StakeEntryKind',
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'Permissioned'
          },
          {
            'name': 'Permissionless'
          }
        ]
      }
    }
  ],
  'errors': [
    {
      'code': 6000,
      'name': 'InvalidOriginalMint',
      'msg': 'Original mint is invalid'
    },
    {
      'code': 6001,
      'name': 'InvalidTokenManagerMint',
      'msg': 'Token Manager mint is invalid'
    },
    {
      'code': 6002,
      'name': 'InvalidUserOriginalMintTokenAccount',
      'msg': 'Invalid user original mint token account'
    },
    {
      'code': 6003,
      'name': 'InvalidUserMintTokenAccount',
      'msg': 'Invalid user token manager mint account'
    },
    {
      'code': 6004,
      'name': 'InvalidStakeEntryOriginalMintTokenAccount',
      'msg': 'Invalid stake entry original mint token account'
    },
    {
      'code': 6005,
      'name': 'InvalidStakeEntryMintTokenAccount',
      'msg': 'Invalid stake entry token manager mint token account'
    },
    {
      'code': 6006,
      'name': 'InvalidUnstakeUser',
      'msg': 'Invalid unstake user only last staker can unstake'
    },
    {
      'code': 6007,
      'name': 'InvalidStakePool',
      'msg': 'Invalid stake pool'
    },
    {
      'code': 6008,
      'name': 'NoMintMetadata',
      'msg': 'No mint metadata'
    },
    {
      'code': 6009,
      'name': 'MintNotAllowedInPool',
      'msg': 'Mint not allowed in this pool'
    },
    {
      'code': 6010,
      'name': 'InvalidPoolAuthority',
      'msg': 'Invalid stake pool authority'
    },
    {
      'code': 6011,
      'name': 'InvalidStakeType',
      'msg': 'Invalid stake type'
    },
    {
      'code': 6012,
      'name': 'InvalidStakeEntryStakeTokenAccount',
      'msg': 'Invalid stake entry stake token account'
    },
    {
      'code': 6013,
      'name': 'InvalidLastStaker',
      'msg': 'Invalid last staker'
    },
    {
      'code': 6014,
      'name': 'InvalidTokenManagerProgram',
      'msg': 'Invalid token manager program'
    },
    {
      'code': 6015,
      'name': 'InvalidReceiptMint',
      'msg': 'Invalid receipt mint'
    },
    {
      'code': 6016,
      'name': 'StakeEntryAlreadyStaked',
      'msg': 'Stake entry already has tokens staked'
    },
    {
      'code': 6017,
      'name': 'InvalidAuthority',
      'msg': 'Invalid authority'
    },
    {
      'code': 6018,
      'name': 'CannotCloseStakedEntry',
      'msg': 'Cannot close staked entry'
    },
    {
      'code': 6019,
      'name': 'CannotClosePoolWithStakedEntries',
      'msg': 'Cannot close staked entry'
    },
    {
      'code': 6020,
      'name': 'CooldownSecondRemaining',
      'msg': 'Token still has some cooldown seconds remaining'
    },
    {
      'code': 6021,
      'name': 'MinStakeSecondsNotSatisfied',
      'msg': 'Minimum stake seconds not satisfied'
    },
    {
      'code': 6022,
      'name': 'InvalidStakeAuthorizationRecord',
      'msg': 'Invalid stake authorization provided'
    },
    {
      'code': 6023,
      'name': 'InvalidMintMetadata',
      'msg': 'Invalid mint metadata'
    },
    {
      'code': 6024,
      'name': 'StakePoolHasEnded',
      'msg': 'Stake pool has ended'
    },
    {
      'code': 6025,
      'name': 'InvalidMintMetadataOwner',
      'msg': 'Mint metadata is owned by the incorrect program'
    },
    {
      'code': 6026,
      'name': 'StakeMintAlreadyInitialized',
      'msg': 'Stake mint already intialized'
    },
    {
      'code': 6027,
      'name': 'AccessDenied',
      'msg': 'Access Denied'
    },
    {
      'code': 6028,
      'name': 'WrongBattlePeriod',
      'msg': 'The battle period is wrong'
    },
    {
      'code': 6029,
      'name': 'AlreadyEnd',
      'msg': 'The bet round is already finished'
    },
    {
      'code': 6030,
      'name': 'NoStart',
      'msg': 'The bet round is not started yet'
    },
    {
      'code': 6031,
      'name': 'NoEnoughSol',
      'msg': "User doesn't have enough SOL"
    },
    {
      'code': 6032,
      'name': 'NoClose',
      'msg': 'Betting is not closed yet'
    },
    {
      'code': 6033,
      'name': 'AlreadyRewardClaim',
      'msg': 'User already claimed the reward'
    },
    {
      'code': 6034,
      'name': 'NotStakedItem',
      'msg': 'This nft is not staked.'
    },
    {
      'code': 6035,
      'name': 'TokenTransferFailed',
      'msg': 'Token transfer failed'
    },
    {
      'code': 6036,
      'name': 'TokenMintFailed',
      'msg': 'Token mint failed'
    },
    {
      'code': 6037,
      'name': 'InitializeTokenAccountFailed',
      'msg': 'Initialize token account failed'
    },
    {
      'code': 6038,
      'name': 'SetAccountAuthorityFailed',
      'msg': 'Set account authority failed'
    },
    {
      'code': 6039,
      'name': 'CloseAccountFailed',
      'msg': 'Close account failed'
    },
    {
      'code': 6040,
      'name': 'MetadataDoesntExist',
      'msg': "Metadata doesn't exist"
    },
    {
      'code': 6041,
      'name': 'NoAuthorizedCreatorsFoundInMetadata',
      'msg': 'No authorized creators found in metadata'
    },
    {
      'code': 6042,
      'name': 'NoAuthorizedNameStartFoundInMetadata',
      'msg': 'No authorized name start found in metadata'
    },
    {
      'code': 6043,
      'name': 'DerivedKeyInvalid',
      'msg': 'Derived key invalid'
    },
    {
      'code': 6044,
      'name': 'IncorrectOwner',
      'msg': 'Incorrect owner'
    },
    {
      'code': 6045,
      'name': 'AlreadyExist',
      'msg': 'This admin is already registered.'
    },
    {
      'code': 6046,
      'name': 'NoExist',
      'msg': 'This admin is not exist.'
    }
  ]
};

export const IDL: Alphabets = {
  'version': '1.10.0',
  'name': 'alphabets',
  'instructions': [
    {
      'name': 'initialize',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'escrowAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'abpMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'abpVault',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'addAdmin',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        }
      ],
      'args': [
        {
          'name': 'admin',
          'type': 'publicKey'
        }
      ]
    },
    {
      'name': 'removeAdmin',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        }
      ],
      'args': [
        {
          'name': 'admin',
          'type': 'publicKey'
        }
      ]
    },
    {
      'name': 'startBattle',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        },
        {
          'name': 'startTime',
          'type': 'u32'
        },
        {
          'name': 'endTime',
          'type': 'u32'
        },
        {
          'name': 'betFee',
          'type': 'u16'
        },
        {
          'name': 'abpAmount',
          'type': 'u64'
        },
        {
          'name': 'teamLProject',
          'type': 'publicKey'
        },
        {
          'name': 'teamRProject',
          'type': 'publicKey'
        }
      ]
    },
    {
      'name': 'determineBattle',
      'accounts': [
        {
          'name': 'adminAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'escrowAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'superAdmin',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'admin',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        }
      ]
    },
    {
      'name': 'userBet',
      'accounts': [
        {
          'name': 'userAccount',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'escrowAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userBattleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        },
        {
          'name': 'betSide',
          'type': 'bool'
        },
        {
          'name': 'betAmount',
          'type': 'u64'
        }
      ]
    },
    {
      'name': 'claimReward',
      'accounts': [
        {
          'name': 'escrowAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userAccount',
          'isMut': false,
          'isSigner': true
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userBattleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'abpMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'abpVault',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'abpTo',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        },
        {
          'name': 'nonceAbpVault',
          'type': 'u8'
        }
      ]
    },
    {
      'name': 'initIdentifier',
      'accounts': [
        {
          'name': 'identifier',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'payer',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'initPool',
      'accounts': [
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'identifier',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'payer',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'ix',
          'type': {
            'defined': 'InitPoolIx'
          }
        }
      ]
    },
    {
      'name': 'initEntry',
      'accounts': [
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'originalMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'originalMintMetadata',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'payer',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'user',
          'type': 'publicKey'
        },
        {
          'name': 'battleId',
          'type': 'string'
        }
      ]
    },
    {
      'name': 'stake',
      'accounts': [
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'stakeEntryOriginalMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'originalMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userBattleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userOriginalMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': [
        {
          'name': 'battleId',
          'type': 'string'
        },
        {
          'name': 'amount',
          'type': 'u64'
        },
        {
          'name': 'side',
          'type': 'bool'
        }
      ]
    },
    {
      'name': 'claimReceiptMint',
      'accounts': [
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'originalMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'receiptMint',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakeEntryReceiptMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'userReceiptMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenManagerReceiptMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenManager',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'mintCounter',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'tokenManagerProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'associatedTokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'systemProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'unstake',
      'accounts': [
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'originalMint',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakeEntryOriginalMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'battleAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'userOriginalMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'returnReceiptMint',
      'accounts': [
        {
          'name': 'stakeEntry',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'receiptMint',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenManager',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenManagerTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'userReceiptMintTokenAccount',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'user',
          'isMut': true,
          'isSigner': true
        },
        {
          'name': 'collector',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'tokenProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'tokenManagerProgram',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'rent',
          'isMut': false,
          'isSigner': false
        }
      ],
      'args': []
    },
    {
      'name': 'closeStakePool',
      'accounts': [
        {
          'name': 'stakePool',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'authority',
          'isMut': true,
          'isSigner': true
        }
      ],
      'args': []
    },
    {
      'name': 'closeStakeEntry',
      'accounts': [
        {
          'name': 'stakePool',
          'isMut': false,
          'isSigner': false
        },
        {
          'name': 'stakeEntry',
          'isMut': true,
          'isSigner': false
        },
        {
          'name': 'authority',
          'isMut': true,
          'isSigner': true
        }
      ],
      'args': []
    }
  ],
  'accounts': [
    {
      'name': 'battleAccount',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'totalLAmount',
            'type': 'u64'
          },
          {
            'name': 'totalRAmount',
            'type': 'u64'
          },
          {
            'name': 'teamLNfts',
            'type': 'u32'
          },
          {
            'name': 'teamRNfts',
            'type': 'u32'
          },
          {
            'name': 'startTime',
            'type': 'u32'
          },
          {
            'name': 'endTime',
            'type': 'u32'
          },
          {
            'name': 'isClose',
            'type': 'bool'
          },
          {
            'name': 'betFee',
            'type': 'u16'
          },
          {
            'name': 'abpAmount',
            'type': 'u64'
          },
          {
            'name': 'winnerResult',
            'type': 'u8'
          },
          {
            'name': 'teamLProject',
            'type': 'publicKey'
          },
          {
            'name': 'teamRProject',
            'type': 'publicKey'
          }
        ]
      }
    },
    {
      'name': 'adminAccount',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'superAdmin',
            'type': 'publicKey'
          },
          {
            'name': 'adminList',
            'type': {
              'vec': 'publicKey'
            }
          }
        ]
      }
    },
    {
      'name': 'userBattleAccount',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'betLAmount',
            'type': 'u64'
          },
          {
            'name': 'betRAmount',
            'type': 'u64'
          },
          {
            'name': 'userLNfts',
            'type': 'u32'
          },
          {
            'name': 'userRNfts',
            'type': 'u32'
          },
          {
            'name': 'isClaim',
            'type': 'bool'
          },
          {
            'name': 'startTime',
            'type': 'u32'
          },
          {
            'name': 'betSide',
            'type': 'bool'
          }
        ]
      }
    },
    {
      'name': 'stakeEntry',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'pool',
            'type': 'publicKey'
          },
          {
            'name': 'amount',
            'type': 'u64'
          },
          {
            'name': 'originalMint',
            'type': 'publicKey'
          },
          {
            'name': 'originalMintClaimed',
            'type': 'bool'
          },
          {
            'name': 'lastStaker',
            'type': 'publicKey'
          },
          {
            'name': 'stakeMintClaimed',
            'type': 'bool'
          },
          {
            'name': 'kind',
            'type': 'u8'
          },
          {
            'name': 'stakeMint',
            'type': {
              'option': 'publicKey'
            }
          },
          {
            'name': 'battleId',
            'type': 'string'
          }
        ]
      }
    },
    {
      'name': 'stakePool',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'identifier',
            'type': 'u64'
          },
          {
            'name': 'authority',
            'type': 'publicKey'
          },
          {
            'name': 'resetOnStake',
            'type': 'bool'
          },
          {
            'name': 'totalStaked',
            'type': 'u32'
          }
        ]
      }
    },
    {
      'name': 'stakeAuthorizationRecord',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'pool',
            'type': 'publicKey'
          },
          {
            'name': 'mint',
            'type': 'publicKey'
          }
        ]
      }
    },
    {
      'name': 'identifier',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'bump',
            'type': 'u8'
          },
          {
            'name': 'count',
            'type': 'u64'
          }
        ]
      }
    }
  ],
  'types': [
    {
      'name': 'InitPoolIx',
      'type': {
        'kind': 'struct',
        'fields': [
          {
            'name': 'authority',
            'type': 'publicKey'
          }
        ]
      }
    },
    {
      'name': 'StakeEntryKind',
      'type': {
        'kind': 'enum',
        'variants': [
          {
            'name': 'Permissioned'
          },
          {
            'name': 'Permissionless'
          }
        ]
      }
    }
  ],
  'errors': [
    {
      'code': 6000,
      'name': 'InvalidOriginalMint',
      'msg': 'Original mint is invalid'
    },
    {
      'code': 6001,
      'name': 'InvalidTokenManagerMint',
      'msg': 'Token Manager mint is invalid'
    },
    {
      'code': 6002,
      'name': 'InvalidUserOriginalMintTokenAccount',
      'msg': 'Invalid user original mint token account'
    },
    {
      'code': 6003,
      'name': 'InvalidUserMintTokenAccount',
      'msg': 'Invalid user token manager mint account'
    },
    {
      'code': 6004,
      'name': 'InvalidStakeEntryOriginalMintTokenAccount',
      'msg': 'Invalid stake entry original mint token account'
    },
    {
      'code': 6005,
      'name': 'InvalidStakeEntryMintTokenAccount',
      'msg': 'Invalid stake entry token manager mint token account'
    },
    {
      'code': 6006,
      'name': 'InvalidUnstakeUser',
      'msg': 'Invalid unstake user only last staker can unstake'
    },
    {
      'code': 6007,
      'name': 'InvalidStakePool',
      'msg': 'Invalid stake pool'
    },
    {
      'code': 6008,
      'name': 'NoMintMetadata',
      'msg': 'No mint metadata'
    },
    {
      'code': 6009,
      'name': 'MintNotAllowedInPool',
      'msg': 'Mint not allowed in this pool'
    },
    {
      'code': 6010,
      'name': 'InvalidPoolAuthority',
      'msg': 'Invalid stake pool authority'
    },
    {
      'code': 6011,
      'name': 'InvalidStakeType',
      'msg': 'Invalid stake type'
    },
    {
      'code': 6012,
      'name': 'InvalidStakeEntryStakeTokenAccount',
      'msg': 'Invalid stake entry stake token account'
    },
    {
      'code': 6013,
      'name': 'InvalidLastStaker',
      'msg': 'Invalid last staker'
    },
    {
      'code': 6014,
      'name': 'InvalidTokenManagerProgram',
      'msg': 'Invalid token manager program'
    },
    {
      'code': 6015,
      'name': 'InvalidReceiptMint',
      'msg': 'Invalid receipt mint'
    },
    {
      'code': 6016,
      'name': 'StakeEntryAlreadyStaked',
      'msg': 'Stake entry already has tokens staked'
    },
    {
      'code': 6017,
      'name': 'InvalidAuthority',
      'msg': 'Invalid authority'
    },
    {
      'code': 6018,
      'name': 'CannotCloseStakedEntry',
      'msg': 'Cannot close staked entry'
    },
    {
      'code': 6019,
      'name': 'CannotClosePoolWithStakedEntries',
      'msg': 'Cannot close staked entry'
    },
    {
      'code': 6020,
      'name': 'CooldownSecondRemaining',
      'msg': 'Token still has some cooldown seconds remaining'
    },
    {
      'code': 6021,
      'name': 'MinStakeSecondsNotSatisfied',
      'msg': 'Minimum stake seconds not satisfied'
    },
    {
      'code': 6022,
      'name': 'InvalidStakeAuthorizationRecord',
      'msg': 'Invalid stake authorization provided'
    },
    {
      'code': 6023,
      'name': 'InvalidMintMetadata',
      'msg': 'Invalid mint metadata'
    },
    {
      'code': 6024,
      'name': 'StakePoolHasEnded',
      'msg': 'Stake pool has ended'
    },
    {
      'code': 6025,
      'name': 'InvalidMintMetadataOwner',
      'msg': 'Mint metadata is owned by the incorrect program'
    },
    {
      'code': 6026,
      'name': 'StakeMintAlreadyInitialized',
      'msg': 'Stake mint already intialized'
    },
    {
      'code': 6027,
      'name': 'AccessDenied',
      'msg': 'Access Denied'
    },
    {
      'code': 6028,
      'name': 'WrongBattlePeriod',
      'msg': 'The battle period is wrong'
    },
    {
      'code': 6029,
      'name': 'AlreadyEnd',
      'msg': 'The bet round is already finished'
    },
    {
      'code': 6030,
      'name': 'NoStart',
      'msg': 'The bet round is not started yet'
    },
    {
      'code': 6031,
      'name': 'NoEnoughSol',
      'msg': "User doesn't have enough SOL"
    },
    {
      'code': 6032,
      'name': 'NoClose',
      'msg': 'Betting is not closed yet'
    },
    {
      'code': 6033,
      'name': 'AlreadyRewardClaim',
      'msg': 'User already claimed the reward'
    },
    {
      'code': 6034,
      'name': 'NotStakedItem',
      'msg': 'This nft is not staked.'
    },
    {
      'code': 6035,
      'name': 'TokenTransferFailed',
      'msg': 'Token transfer failed'
    },
    {
      'code': 6036,
      'name': 'TokenMintFailed',
      'msg': 'Token mint failed'
    },
    {
      'code': 6037,
      'name': 'InitializeTokenAccountFailed',
      'msg': 'Initialize token account failed'
    },
    {
      'code': 6038,
      'name': 'SetAccountAuthorityFailed',
      'msg': 'Set account authority failed'
    },
    {
      'code': 6039,
      'name': 'CloseAccountFailed',
      'msg': 'Close account failed'
    },
    {
      'code': 6040,
      'name': 'MetadataDoesntExist',
      'msg': "Metadata doesn't exist"
    },
    {
      'code': 6041,
      'name': 'NoAuthorizedCreatorsFoundInMetadata',
      'msg': 'No authorized creators found in metadata'
    },
    {
      'code': 6042,
      'name': 'NoAuthorizedNameStartFoundInMetadata',
      'msg': 'No authorized name start found in metadata'
    },
    {
      'code': 6043,
      'name': 'DerivedKeyInvalid',
      'msg': 'Derived key invalid'
    },
    {
      'code': 6044,
      'name': 'IncorrectOwner',
      'msg': 'Incorrect owner'
    },
    {
      'code': 6045,
      'name': 'AlreadyExist',
      'msg': 'This admin is already registered.'
    },
    {
      'code': 6046,
      'name': 'NoExist',
      'msg': 'This admin is not exist.'
    }
  ]
};
