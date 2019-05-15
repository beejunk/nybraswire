// @flow

export type AlertState = {
  +color: string,
  +message: string,
  +show: boolean,
};

export type FormState = {
  +title: string,
  +body: string,
  +postedOn: number,
};

export type PostType =
  & FormState
  & {
    +id: string,
    +createdOn: number,
    +updatedOn: number,
    +active: boolean,
  };
