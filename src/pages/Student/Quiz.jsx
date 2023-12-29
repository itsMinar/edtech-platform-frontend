import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useAddQuizMarkMutation } from '../../redux/features/quizMark/quizMarkApi';
import { useGetQuizzesQuery } from '../../redux/features/quizzes/quizzesApi';
import { useGetVideoQuery } from '../../redux/features/videos/videosApi';

export default function Quiz() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { videoId } = useParams();
  const { data: video } = useGetVideoQuery(videoId);
  const {
    isLoading: quizLoading,
    isError,
    error,
    data: quizzes,
  } = useGetQuizzesQuery();
  const [addQuizMark, { isLoading, isSuccess }] = useAddQuizMarkMutation();

  const [quizList, setQuizList] = useState([]);

  const quizMark = 5;

  const videoQuizzes = useMemo(
    () => quizzes?.filter((item) => item?.video_id === Number(videoId)),
    [quizzes, videoId]
  );

  const selectedVideo = useMemo(
    () =>
      videoQuizzes?.map((item, idx) => {
        const options = item?.options?.map((el, i) => {
          return {
            ...el,
            selected: false,
          };
        });

        return {
          ...item,
          options,
        };
      }),
    [videoQuizzes]
  );

  useEffect(() => {
    if (selectedVideo?.length) {
      setQuizList(selectedVideo);
    } else {
      setQuizList([]);
    }
  }, [selectedVideo]);

  const handleChangeQuiz = (quizIdx, optionIdx) => {
    setQuizList((prevQuizList) =>
      prevQuizList.map((item, idx) => ({
        ...item,
        options: item?.options?.map((el, i) => ({
          ...el,
          selected:
            quizIdx === idx && optionIdx === i ? !el?.selected : el?.selected,
        })),
      }))
    );
  };

  const rightQuiz = useMemo(
    () =>
      quizList?.filter((quiz, idx) => {
        const rightQuiz = quiz?.options?.filter(
          (el, i) => el?.selected === el?.isCorrect
        );
        return rightQuiz?.length === 4;
      }),
    [quizList]
  );

  const handleQuizSubmit = () => {
    const quizSubmission = {
      student_id: auth?.id,
      student_name: auth?.name,
      video_id: video?.id,
      video_title: video?.title,
      totalQuiz: videoQuizzes?.length,
      totalCorrect: rightQuiz?.length,
      totalWrong: videoQuizzes?.length - rightQuiz?.length,
      totalMark: videoQuizzes?.length * quizMark,
      mark: rightQuiz?.length * quizMark,
    };

    setQuizList([]);
    addQuizMark(quizSubmission);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/leader-board');
    }
  }, [isSuccess, navigate]);

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-0">
      {quizLoading ? (
        <div className="text-center my-4">Loading...</div>
      ) : isError ? (
        <div className="text-center my-4">{error?.data || 'Error Found'}</div>
      ) : videoQuizzes?.length > 0 ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Quizzes for &quot;{video?.title}&quot;
            </h1>
            <p className="text-sm text-slate-200">
              Each question contains {quizMark} Mark
            </p>
          </div>
          <div className="space-y-8 ">
            {videoQuizzes?.map((item, idx) => (
              <div className="quiz" key={item?.id}>
                <h4 className="question">
                  Quiz {idx + 1} - {item?.question}
                </h4>
                <form className="quizOptions">
                  {item?.options?.map((el, i) => (
                    <label htmlFor={`option${i + 1}_q${idx + 1}`} key={el?.id}>
                      <input
                        type="checkbox"
                        id={`option${i + 1}_q${idx + 1}`}
                        value={quizList?.[idx]?.options?.[i]?.selected}
                        onChange={() => handleChangeQuiz(idx, i)}
                      />
                      {el?.option}
                    </label>
                  ))}
                </form>
              </div>
            ))}
          </div>

          <button
            className="px-4 py-2 rounded-full bg-cyan block ml-auto mt-8 hover:opacity-90 active:opacity-100 active:scale-95 "
            disabled={isLoading}
            onClick={handleQuizSubmit}
          >
            Submit
          </button>
        </>
      ) : (
        <div className="text-center my-4">Quiz Not Found</div>
      )}
    </div>
  );
}
