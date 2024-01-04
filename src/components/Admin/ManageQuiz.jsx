import { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  useAddQuizzesMutation,
  useEditQuizzesMutation,
} from '../../redux/features/quizzes/quizzesApi';
import { useGetVideosQuery } from '../../redux/features/videos/videosApi';
import ManageModal from '../Common/ManageModal';

const initialValues = {
  question: '',
  video_id: { id: '', title: '' },
  options: [],
};

export default function ManageQuiz({ type, data, open, closeModal }) {
  const { data: videoList } = useGetVideosQuery();

  const [addQuizzes, { isSuccess: isAddSuccess, isLoading: isAddLoading }] =
    useAddQuizzesMutation();
  const [editQuizzes, { isSuccess: isEditSuccess, isLoading: isEditLoading }] =
    useEditQuizzesMutation();
  const [quizListData, setQuizListData] = useState(initialValues);
  const [quizData, setQuizData] = useState({
    option: '',
    isCorrect: false,
    id: '',
  });

  // handle assignment data change
  const handleAssignmentInfoChange = (e) => {
    setQuizListData((prevInfo) => ({
      ...prevInfo,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (quizListData?.options?.length !== 4) {
      return toast.warning('Quiz options must be 4 option');
    }

    if (type === 'edit') {
      editQuizzes({
        data: {
          ...quizListData,
          video_id: quizListData?.video_id?.id,
          video_title: quizListData?.video_id?.title,
        },
        id: data?.id,
      });
    } else {
      addQuizzes({
        ...quizListData,
        video_id: quizListData?.video_id?.id,
        video_title: quizListData?.video_id?.title,
      });
    }
  };

  const handleQuizData = (e) => {
    // console.log(e.target?.name, e.target.value);
    setQuizData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === 'isCorrect'
          ? Boolean(e.target.checked)
          : e.target.value,
    }));
  };

  // handle add quiz
  const handleAddQuiz = () => {
    if (!quizData.option) {
      return toast.warning('Please type a option');
    }

    const findQuiz = quizListData?.options?.find(
      (item) => item?.id === quizData?.id
    );
    const updatedQuiz = quizListData?.options?.map((item) => {
      if (item?.id === quizData?.id) {
        return quizData;
      } else {
        return item;
      }
    });

    setQuizListData((prevInfo) => ({
      ...prevInfo,
      options: findQuiz
        ? updatedQuiz
        : [
            ...prevInfo?.options,
            {
              ...quizData,
              id: quizData?.id || quizListData?.options?.length + 1,
            },
          ],
    }));

    setQuizData({
      option: '',
      isCorrect: false,
      id: '',
    });
  };

  // handle delete quiz option
  const deleteQuizOption = (id) => {
    setQuizListData((prev) => ({
      ...prev,
      options: prev?.options?.filter((item) => item?.id !== id),
    }));
  };

  // handle option edit
  const handleOptionEdit = (id) => {
    const findOption = quizListData?.options?.find((el) => el?.id === id);
    setQuizData(findOption);
  };

  useEffect(() => {
    //   when submitted successfully then close modal
    if (isAddSuccess || isEditSuccess) {
      toast.success(
        `Quiz ${type === 'edit' ? 'Info Updated' : 'Added'} Successfully!`
      );
      closeModal();
    }
  }, [isAddSuccess, isEditSuccess, closeModal, type]);

  useEffect(() => {
    if (type === 'edit') {
      setQuizListData({
        question: data?.question,
        video_id: { id: data?.video_id, title: data?.video_title },
        options: data?.options,
      });
    }
  }, [type, data]);

  return (
    <ManageModal
      isOpen={open}
      handleClose={closeModal}
      title={
        type === 'add' ? 'Add Quiz' : type === 'edit' ? 'Update Quiz' : 'Quiz'
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form_control">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            placeholder="Question"
            required
            name="question"
            value={quizListData?.question}
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
              (el) => el?.id === quizListData?.video_id?.id
            )}
            onChange={(newValue) =>
              setQuizListData((prevInfo) => ({
                ...prevInfo,
                video_id: { id: newValue?.id, title: newValue?.title },
              }))
            }
          />
        </div>

        <div>
          <h3>Quiz Options</h3>
          {quizListData?.options?.length > 0 && (
            <ul>
              {quizListData?.options?.map((item) => (
                <li
                  className="flex justify-between items-center gap-2"
                  key={item?.id}
                >
                  <div>
                    <input type="checkbox" checked={item?.isCorrect} readOnly />{' '}
                    <span>{item?.option}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 hover:text-red-500 cursor-pointer transition-all"
                      onClick={() => deleteQuizOption(item?.id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 hover:text-blue-500 cursor-pointer transition-all"
                      onClick={() => handleOptionEdit(item?.id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="option_group">
            <div className="form_control">
              <label htmlFor="option">Option</label>
              <input
                type="text"
                id="option"
                placeholder="option"
                name="option"
                value={quizData?.option}
                onChange={handleQuizData}
              />
            </div>
            <div className="correct_item">
              <div>
                <input
                  type="checkbox"
                  id="isCorrect"
                  name="isCorrect"
                  checked={quizData?.isCorrect}
                  onChange={handleQuizData}
                />{' '}
                <label htmlFor="isCorrect">Is Correct</label>
              </div>
              <div className="btn_class">
                <button className="btn" type="button" onClick={handleAddQuiz}>
                  {quizData?.id ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="submitted_btn">
          <button className="btn" disabled={isAddLoading || isEditLoading}>
            {isAddLoading || isEditLoading
              ? 'Loading...'
              : type === 'add'
                ? 'Add Quiz'
                : type === 'edit'
                  ? 'Update Quiz'
                  : 'Submit'}
          </button>
        </div>
      </form>
    </ManageModal>
  );
}
