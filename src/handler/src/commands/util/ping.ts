import { injectable } from 'tsyringe';
import { APIMessage } from 'discord-api-types/v6';
import { Args } from 'lexure';
import Rest from '@yuudachi/rest';
import i18next from 'i18next';

import Command from '../../Command';

@injectable()
export default class implements Command {
	public constructor(private readonly rest: Rest) {}

	public async execute(message: APIMessage, _: Args, locale: string) {
		const msg: APIMessage = await this.rest.post(`/channels/${message.channel_id}/messages`, {
			content: i18next.t('command.ping.execute.pre_ping', { lng: locale }),
		});
		void this.rest.patch(`/channels/${message.channel_id}/messages/${msg.id}`, {
			content: i18next.t('command.ping.execute.post_ping', {
				ping:
					Date.parse(msg.edited_timestamp ?? msg.timestamp) - Date.parse(message.edited_timestamp ?? message.timestamp),
				lng: locale,
			}),
		});
	}
}
