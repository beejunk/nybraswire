import React from 'react';
import { NextPage } from 'next';
import { Alert } from 'reactstrap';

import Layout from '../../components/shared/Layout';
import PostEditPage from '../../components/posts/PostEditPage';
import PostEditForm from '../../components/posts/PostEditForm';
import { getLocalDate, getLocalTime } from '../../utils/dateUtils';
import usePostEditActions from '../../hooks/usePostEditActions';

import { FormState } from '../../types/posts';

// -----------------
// Helper functions.
// -----------------

const validateContent = (form: FormState): boolean => {
  const contentIsNotEmpty = (form.title !== '') && (form.body !== '');
  return contentIsNotEmpty;
};

const getDefaultFormState = (): FormState => {
  const now = Date.now();

  return {
    title: '',
    body: '',
    postedOnDate: getLocalDate(now),
    postedOnTime: getLocalTime(now),
  };
};

const Create: NextPage = () => {
  const initialState = {
    alert: { color: 'success', message: '', show: false },
    form: getDefaultFormState(),
    preview: false,
  };

  const [postEditState, postActions] = usePostEditActions(initialState);

  return (
    <Layout title="Edit Post">
      <Alert
        isOpen={postEditState.alert.show}
        toggle={(): void => { postActions.updateAlert({ ...postEditState.alert, show: false }); }}
        color={postEditState.alert.color}
      >
        {postEditState.alert.message}
      </Alert>

      <PostEditPage
        form={postEditState.form}
        togglePreview={postActions.togglePreview}
        preview={postEditState.preview}
      >
        <PostEditForm
          form={postEditState.form}
          submit={(): void => { postActions.submit(postEditState.form); }}
          disableSubmit={!validateContent(postEditState.form)}
          updateForm={postActions.updateForm}
        />
      </PostEditPage>
    </Layout>
  );
};

export default Create;
