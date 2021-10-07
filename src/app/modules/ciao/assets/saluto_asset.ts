import { AccountCreateCommand } from 'lisk-commander';
import { BaseAsset, ApplyAssetContext, ValidateAssetContext, codec } from 'lisk-sdk';
import { accountCiao } from '../ciao_module';
import {CHAIN_STATE_HELLO_COUNTER, counter, counterSchema} from '../counter'

export type saluto = {
	messaggio : string
}

export const salutoSchema = {
	$id: 'ciao/saluto-asset',
	title: 'SalutoAsset transaction asset for ciao module',
	type: 'object',
	required: ['messaggio'],
	properties: {
		messaggio: {
			dataType: 'string',
			fieldNumber: 1,
			maxLength: 64
		}
	},
}

export class SalutoAsset extends BaseAsset {
	public name = 'saluto';
	public id = 0;

	// Define schema for asset
	public schema = salutoSchema;

	public validate({ asset }: ValidateAssetContext<saluto>): void {
		// Validate your asset
		if (asset.messaggio === "aru culu") {
			throw new Error (
				'MODERA I PAROLI'
			)
		}
	}

		// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<saluto>): Promise<void> {
			// 1. Get account data of the sender of the hello transaction
			const senderAddress = transaction.senderAddress;
			const senderAccount = await stateStore.account.get<AccountCreateCommand & accountCiao>(senderAddress);
		
			// 2. Update hello message in the senders account with thehelloString of the transaction asset
			senderAccount.ciao.mex = asset.messaggio;
			stateStore.account.set(senderAccount.address, senderAccount);
		
			// 3. Get the hello counter from the database
			let counterBuffer = await stateStore.chain.get(
				CHAIN_STATE_HELLO_COUNTER
			);

			if (!counterBuffer) {
				throw new Error (
					'non saluta nessuno'
				)
			}
		
			// 4. Decode the hello counter
			let counter = codec.decode<counter>(
				counterSchema,
				counterBuffer
			);
		
			// 5. Increment the hello counter +1
			counter.numeroDiSaluti++;
		
			// 6. Encode the hello counter and save it back to the database
			await stateStore.chain.set(
				CHAIN_STATE_HELLO_COUNTER,
				codec.encode(counterSchema, counter)
			);
		}
}
