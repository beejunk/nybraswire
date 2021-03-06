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

import { FormState } from '../../types/posts';

type Props = {
  form: FormState;
  disableSubmit: boolean;
  updateForm: (form: FormState) => void;
  submit: () => void;
}

const PostEditForm: React.FC<Props> = function PostEditForm({
  disableSubmit,
  form,
  updateForm,
  submit,
}: Props) {
  function createPostChangeHandler(field: string) {
    return function handlePostChange(ev: React.ChangeEvent<HTMLInputElement>): void {
      updateForm({ ...form, [field]: ev.currentTarget.value });
    };
  }

  function handleDateChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    const postedOnDate = ev.currentTarget.value;
    updateForm({ ...form, postedOnDate });
  }

  function handleTimeChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    const postedOnTime = ev.currentTarget.value;
    updateForm({ ...form, postedOnTime });
  }

  return (
    <Form className="mb-3">
      <Row form>
        <Col sm={12} md={8}>
          <FormGroup>
            <Label for="postTitle">Title</Label>
            <Input
              id="postTitle"
              name="title"
              value={form.title}
              onChange={createPostChangeHandler('title')}
            />
          </FormGroup>
        </Col>

        <Col sm={6} md={2}>
          <FormGroup>
            <Label for="postedOnDate">Date Posted</Label>
            <Input
              type="date"
              name="postedOnDate"
              id="postedOnDate"
              onChange={handleDateChange}
              value={form.postedOnDate}
            />
          </FormGroup>
        </Col>

        <Col sm={6} md={2}>
          <FormGroup>
            <Label for="postedOnDate">Time Posted</Label>
            <Input
              type="time"
              name="postedOnDate"
              id="postedOnDate"
              onChange={handleTimeChange}
              value={form.postedOnTime}
              step="1"
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
              onChange={createPostChangeHandler('body')}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row form>
        <Col xs={6} sm={3}>
          <Button block onClick={submit} disabled={disableSubmit}>
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PostEditForm;
