// @flow

export type AlertState = {
  +color: string,
  +message: string,
  +show: boolean,
};

export type FormState = {
  +title: string,
  +body: string,
  +postedOnDate: string,
  +postedOnTime: string,
};

export type PostType = {
  +title: string,
  +body: string,
  +createdOn: number,
  +updatedOn: number,
  +postedOn: number,
  +published: boolean
};
