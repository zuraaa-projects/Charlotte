export type StringNullable = string | null

export interface IBot {
  _id: string
  username: string
  discriminator: string
  avatar: StringNullable
  status: string
  owner: string
  dates: IBotsDates
  details: IBotsDetails
  approvedBy: StringNullable
  votes: IBotsVotes
}

export interface IBotsDates {
  sent: Date
}

export interface IBotsDetails {
  prefix: string
  tags: string[]
  library: string
  customInviteLink: StringNullable
  shortDescription: string
  longDescription: StringNullable
  htmlDescription: StringNullable
  supportServer: StringNullable
  website: StringNullable
  isHTML: boolean
  owtherOwners: string[]
  customURL: StringNullable
  donate: StringNullable
  github: StringNullable
  guilds: number
}

export interface IBotsVotes {
  current: number
  voteslog: string[]
}

export interface IUsers {
  _id: string
  username: string
  discriminator: string
  avatar: string
  dates: IUsersDates
  details: IUsersDetails
}

export interface IUsersDates {
  nextVote: Date | null
  lastBotAdd: Date | null
  firstSeen: Date
}

export interface IUsersDetails {
  description: StringNullable
  customURL: StringNullable
}

export interface IWebhook {
  type: 'vote' | 'vote_test'
  data: IWebhookVote
}

export interface IWebhookVote {
  user_id: string
  bot_id: string
  votes: number
}
