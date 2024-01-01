import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { useAddAssignmentMarkMutation } from '../../redux/features/assignmentMark/assignmentMarkApi';
import ManageModal from '../Common/ManageModal';

export default function ManageSubmitAssignment({
  type,
  data,
  open,
  closeModal,
}) {
  const auth = useAuth();
  const [
    addAssignmentMark,
    { isSuccess: isAddSuccess, isLoading: isAddLoading },
  ] = useAddAssignmentMarkMutation();
  const [repoLink, setRepoLink] = useState('');

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!repoLink) {
      return toast.warning('Please add repo-link');
    }

    addAssignmentMark({
      student_id: auth?.id,
      student_name: auth?.name,
      assignment_id: data?.id,
      title: data?.title,
      createdAt: new Date(),
      totalMark: data?.totalMark,
      mark: 0,
      repo_link: repoLink,
      status: 'pending',
    });
  };

  useEffect(() => {
    if (isAddSuccess) {
      setRepoLink('');
      closeModal();
    }
  }, [isAddSuccess, closeModal]);

  return (
    <ManageModal
      isOpen={open}
      handleClose={closeModal}
      title={
        type === 'add'
          ? 'Add Assignment'
          : type === 'edit'
            ? 'Update Assignment'
            : 'Assignment'
      }
    >
      <h3 style={{ marginBottom: '10px' }}>Assignment: {data?.title}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form_control">
          <label htmlFor="repo_link">Github repo-link:</label>
          <input
            type="text"
            id="repo_link"
            placeholder="Github repo-link"
            required
            name="repo_link"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
          />
        </div>

        <div className="submitted_btn">
          <button className="btn" disabled={isAddLoading}>
            {isAddLoading
              ? 'Loading...'
              : type === 'add'
                ? 'Add Assignment'
                : type === 'edit'
                  ? 'Update Assignment'
                  : 'Submit'}
          </button>
        </div>
      </form>
    </ManageModal>
  );
}
