import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useAddVideoMutation,
  useEditVideoMutation,
} from '../../redux/features/videos/videosApi';
import ManageModal from '../Common/ManageModal';

const initialValues = {
  title: '',
  url: '',
  views: '',
  duration: '',
  createdAt: '',
  description: '',
};

export default function ManageVideo({ type, data, open, closeModal }) {
  const [addVideo, { isSuccess: isAddSuccess, isLoading: isAddLoading }] =
    useAddVideoMutation();
  const [editVideo, { isSuccess: isEditSuccess, isLoading: isEditLoading }] =
    useEditVideoMutation();
  const [videosData, setVideosData] = useState(initialValues);

  // handle video data change
  const handleVideosInfoChange = (e) => {
    setVideosData((prevInfo) => ({
      ...prevInfo,
      [e.target.name]: e.target.value,
    }));
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(videosData).filter((item) => item).length !== 6) {
      return toast.warning('Please fil-up video field');
    }

    if (type === 'edit') {
      editVideo({
        data: {
          ...videosData,
          createdAt: moment(videosData?.createdAt).format('YYYY-MM-DD'),
        },
        id: data?.id,
      });
    } else {
      addVideo({
        ...videosData,
        createdAt: moment(videosData?.createdAt).format('YYYY-MM-DD'),
      });
    }
  };

  useEffect(() => {
    if (isAddSuccess || isEditSuccess) {
      setVideosData(initialValues);
      toast.success(
        `Video ${type === 'edit' ? 'Info Updated' : 'Added'} Successfully!`
      );
      closeModal();
    }
  }, [isAddSuccess, isEditSuccess, closeModal, type]);

  useEffect(() => {
    if (type === 'edit') {
      setVideosData({
        title: data?.title,
        url: data?.url,
        views: data?.views,
        duration: data?.duration,
        createdAt: moment(data?.createdAt).format('YYYY-MM-DD'),
        description: data?.description,
      });
    }
  }, [type, data]);

  return (
    <ManageModal
      isOpen={open}
      handleClose={closeModal}
      title={
        type === 'add'
          ? 'Add Video'
          : type === 'edit'
            ? 'Update Video'
            : 'Video'
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form_control">
          <label htmlFor="title">Video Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            required
            name="title"
            value={videosData?.title}
            onChange={handleVideosInfoChange}
          />
        </div>

        <div className="form_control">
          <label htmlFor="url">Video Url</label>
          <input
            type="text"
            id="url"
            placeholder="http://youtube.com/yshe"
            name="url"
            required
            value={videosData?.url}
            onChange={handleVideosInfoChange}
          />
        </div>

        <div className="row">
          <div className="form_control">
            <label htmlFor="views">Views</label>
            <input
              type="text"
              id="views"
              placeholder="views"
              name="views"
              required
              value={videosData?.views}
              onChange={handleVideosInfoChange}
            />
          </div>

          <div className="form_control">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              placeholder="duration"
              name="duration"
              required
              value={videosData?.duration}
              onChange={handleVideosInfoChange}
            />
          </div>

          <div className="form_control">
            <label htmlFor="createdAt">Created Date</label>
            <input
              type="date"
              id="createdAt"
              required
              name="createdAt"
              value={videosData?.createdAt}
              onChange={handleVideosInfoChange}
            />
          </div>
        </div>

        <div className="form_control">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Type Here..."
            name="description"
            required
            rows="4"
            value={videosData?.description}
            onChange={handleVideosInfoChange}
          />
        </div>

        <div className="submitted_btn">
          <button className="btn" disabled={isAddLoading || isEditLoading}>
            {isAddLoading || isEditLoading
              ? 'Loading...'
              : type === 'add'
                ? 'Add Video'
                : type === 'edit'
                  ? 'Update Video'
                  : 'Submit'}
          </button>
        </div>
      </form>
    </ManageModal>
  );
}
