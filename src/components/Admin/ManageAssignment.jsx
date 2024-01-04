import { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  useAddAssignmentMutation,
  useEditAssignmentMutation,
} from '../../redux/features/assignment/assignmentApi';
import { useGetVideosQuery } from '../../redux/features/videos/videosApi';
import ManageModal from '../Common/ManageModal';

const initialValues = {
  title: '',
  video_id: { id: '', title: '' },
  totalMark: '',
};

export default function ManageAssignment({ type, data, open, closeModal }) {
  const { data: videoList } = useGetVideosQuery();
  const [addAssignment, { isSuccess: isAddSuccess, isLoading: isAddLoading }] =
    useAddAssignmentMutation();
  const [
    editAssignment,
    { isSuccess: isEditSuccess, isLoading: isEditLoading },
  ] = useEditAssignmentMutation();
  const [assignmentData, setAssignmentData] = useState(initialValues);

  // handle assignment data change
  const handleAssignmentInfoChange = (e) => {
    setAssignmentData((prevInfo) => ({
      ...prevInfo,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submittedData = {
      ...assignmentData,
      video_id: assignmentData?.video_id?.id,
      video_title: assignmentData?.video_id?.title,
      totalMark: Number(assignmentData?.totalMark),
    };

    if (isNaN(submittedData?.totalMark)) {
      return toast.warning('Please enter a valid total mark!');
    }

    if (type === 'edit') {
      editAssignment({ data: submittedData, id: data?.id });
    } else {
      addAssignment(submittedData);
    }
  };

  useEffect(() => {
    if (isAddSuccess || isEditSuccess) {
      toast.success(
        `Assignment ${type === 'edit' ? 'Info Updated' : 'Added'} Successfully!`
      );
      closeModal();
    }
  }, [isAddSuccess, isEditSuccess, closeModal, type]);

  useEffect(() => {
    if (type === 'edit') {
      setAssignmentData({
        title: data?.title,
        video_id: { id: data?.video_id, title: data?.video_title },
        totalMark: data?.totalMark,
      });
    }
  }, [type, data]);

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
      <form onSubmit={handleSubmit}>
        <div className="form_control">
          <label htmlFor="title">Assignment Title</label>
          <input
            type="text"
            id="title"
            placeholder="Example Title"
            required
            name="title"
            value={assignmentData?.title}
            onChange={handleAssignmentInfoChange}
          />
        </div>

        <div className="form_control">
          <label htmlFor="video_id">Video Title</label>
          <Select
            name="video_id"
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.title}
            options={videoList}
            required
            styles={{
              menu: (provided, state) => ({
                ...provided,
                color: '#fff',
                backgroundColor: '#080e1b',
              }),
            }}
            classNamePrefix="input_bg"
            placeholder="Select Video"
            value={videoList?.find(
              (el) => el?.id === assignmentData?.video_id?.id
            )}
            onChange={(newValue) =>
              setAssignmentData((prevInfo) => ({
                ...prevInfo,
                video_id: { id: newValue?.id, title: newValue?.title },
              }))
            }
          />
        </div>

        <div className="form_control">
          <label htmlFor="totalMark">Total Mark</label>
          <input
            type="number"
            id="totalMark"
            required
            placeholder="Total Mark"
            name="totalMark"
            value={assignmentData?.totalMark}
            onChange={handleAssignmentInfoChange}
          />
        </div>

        <div className="submitted_btn">
          <button className="btn" disabled={isAddLoading || isEditLoading}>
            {isAddLoading || isEditLoading
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
