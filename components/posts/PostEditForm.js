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

import type { PostType } from '../../types/posts';

type Props = {
  form: PostType,
  docId: string,
  disableSubmit: boolean,
  updateForm: (form: PostType) => void,
  submitPost: (docId: string, post: PostType) => void,
};

const PostEditForm = ({
  docId,
  disableSubmit,
  form,
  updateForm,
  submitPost,
}: Props) => (
  <Form className="mb-3">
    <Row>
      <Col sm={6}>
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
    </Row>

    <Row>
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

    <Row>
      <Col xs={6} sm={3}>
        <Button
          block
          onClick={() => {
            submitPost(docId, form);
          }}
          disabled={disableSubmit}
        >
          Submit

        </Button>
      </Col>
    </Row>
  </Form>
);

export default PostEditForm;
