// @flow

import React from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

import type { FormState } from '../../types/posts';

// TODO: Probably want to move this into a utils folder of some kind.
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60 * 1000;
  const offsetDate = new Date(timestamp - offset);

  return offsetDate.toISOString().split('.')[0];
};

type Props = {
  form: FormState,
  disableSubmit: boolean,
  updateForm: (form: FormState) => void,
  submitPost: () => void,
};

const PostEditForm = ({
  disableSubmit,
  form,
  updateForm,
  submitPost,
}: Props) => (
  <Form className="mb-3">
    <Row form>
      <Col sm={12} md={8}>
        <FormGroup>
          <Label for="postTitle">Title</Label>
          <Input
            id="postTitle"
            name="title"
            value={form.title}
            onChange={({ target: { value } }) => {
              updateForm({ ...form, title: value });
            }}
          />
        </FormGroup>
      </Col>

      <Col sm={6} md={4}>
        <FormGroup>
          <Label for="postedOnDate">Posted On</Label>
          <Input
            type="datetime-local"
            name="postedOnDate"
            id="postedOnDate"
            value={formatDate(form.postedOn)}
          />
        </FormGroup>
      </Col>
    </Row>

    <Row form>
      <Col>
        <FormGroup>
          <Label for="postBody">Body</Label>
          <Input
            css={{
              minHeight: '15rem',
            }}
            id="postBody"
            type="textarea"
            name="body"
            value={form.body}
            onChange={({ target: { value } }) => {
              updateForm({ ...form, body: value });
            }}
          />
        </FormGroup>
      </Col>
    </Row>

    <Row form>
      <Col xs={6} sm={3}>
        <Button block onClick={submitPost} disabled={disableSubmit}>
          Submit
        </Button>
      </Col>
    </Row>
  </Form>
);

export default PostEditForm;
