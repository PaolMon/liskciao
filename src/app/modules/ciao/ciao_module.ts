/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext,


    AfterGenesisBlockApplyContext, BaseModule,


    BeforeBlockApplyContext, codec, TransactionApplyContext
} from 'lisk-sdk';
import { saluto, SalutoAsset, salutoSchema } from "./assets/saluto_asset";
import { CHAIN_STATE_HELLO_COUNTER, counter, counterSchema } from './counter';
import { CHAIN_STATE_HELLOS, singolo_saluto, lista_saluti, listaSchema } from './lista';

export type accountCiao = {
    ciao : {
        mex: string
    }
}

export const schemaCiao = {
    type: 'object',
    properties: {
        mex: {
            fieldNumber: 1,
            dataType: 'string',
        },
    },
    default: {
        mex: '',
    },
};

export class CiaoModule extends BaseModule {
    public actions = {
        // Example below
        // getBalance: async (params) => this._dataAccess.account.get(params.address).token.balance,
        // getBlockByID: async (params) => this._dataAccess.blocks.get(params.id),
        quantiSaluti : async () => {
            const res = await this._dataAccess.getChainState(CHAIN_STATE_HELLO_COUNTER);
            if (!res) {
                throw new Error (
                    'su tutti scostumati'
                )
            }

            const count = codec.decode<counter>(
                counterSchema,
                res
            )
            return count
        },
        listaSaluti : async () => {
            const res = await this._dataAccess.getChainState(CHAIN_STATE_HELLOS);
            if (!res) {
                throw new Error (
                    'nessuno ha ancora salutato'
                )
            }

            const list = codec.decode<lista_saluti>(
                listaSchema,
                res
            )
            return list
        }

    };
    public reducers = {
        // Example below
        // getBalance: async (
		// 	params: Record<string, unknown>,
		// 	stateStore: StateStore,
		// ): Promise<bigint> => {
		// 	const { address } = params;
		// 	if (!Buffer.isBuffer(address)) {
		// 		throw new Error('Address must be a buffer');
		// 	}
		// 	const account = await stateStore.account.getOrDefault<TokenAccount>(address);
		// 	return account.token.balance;
		// },
    };
    public name = 'ciao';
    public transactionAssets = [new SalutoAsset()];
    public events = [
        'nuovoSaluto'
        // Example below
        // 'ciao:newBlock',
    ];
    public id = 1010;

    public accountSchema = schemaCiao;

    // public constructor(genesisConfig: GenesisConfig) {
    //     super(genesisConfig);
    // }

    // Lifecycle hooks
    public async beforeBlockApply(_input: BeforeBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async afterBlockApply(_input: AfterBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async beforeTransactionApply(_input: TransactionApplyContext) {
        // Publish a `newHello` event for every received hello transaction
        if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 0) {
            const asset = codec.decode<saluto>(
                salutoSchema,
                _input.transaction.asset
            );

            this._channel.publish('ciao:nuovoSaluto', {
                sender: _input.transaction.senderAddress.toString('hex'),
                hello: asset.messaggio
            });

        }
    }

    public async afterTransactionApply(_input: TransactionApplyContext) {
        // Get any data from stateStore using transaction info, below is an example
        // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
        if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 0) {

            const asset = codec.decode<saluto>(
                salutoSchema,
                _input.transaction.asset
            );

            const res = await this._dataAccess.getChainState(CHAIN_STATE_HELLOS);
            if (!res) {
                throw new Error (
                    'nessuno ha ancora salutato'
                )
            }
            const list = codec.decode<lista_saluti>(
                listaSchema,
                res
            )

            const newSaluto: singolo_saluto = {
                messaggio: asset.messaggio,
                sender: _input.transaction.senderAddress.toString('hex')
            }

            //list.saluti.push(newSaluto)

            const newList: lista_saluti = {
                saluti: [...list.saluti, newSaluto]
            }
            

            await _input.stateStore.chain.set(
                CHAIN_STATE_HELLOS,
                codec.encode(listaSchema, newList)
            )

            

        }
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {

        // Set the hello counter to zero after the genesis block is applied
        const saluti: counter = { numeroDiSaluti: 0 };
        await _input.stateStore.chain.set(
            CHAIN_STATE_HELLO_COUNTER,
            codec.encode(counterSchema, saluti)
        );

        const saluto: lista_saluti = {
            saluti: [
                {
                    messaggio: 'CIAO',
                    sender: 'Mario'
                }
            ]
        }
        await _input.stateStore.chain.set(
            CHAIN_STATE_HELLOS,
            codec.encode(listaSchema, saluto)
        );

        

    }
}
