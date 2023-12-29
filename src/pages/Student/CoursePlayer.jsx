import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useGetAssignmentsQuery } from '../../redux/features/assignment/assignmentApi';
import { useGetAssignmentMarkQuery } from '../../redux/features/assignmentMark/assignmentMarkApi';
import { useGetQuizMarkQuery } from '../../redux/features/quizMark/quizMarkApi';
import { useGetQuizzesQuery } from '../../redux/features/quizzes/quizzesApi';
import { useGetVideosQuery } from '../../redux/features/videos/videosApi';

export default function CoursePlayer() {
  const auth = useAuth();

  const { data: videos, isLoading: videosLoading } = useGetVideosQuery();
  const { data: assignmentMark } = useGetAssignmentMarkQuery();
  const { data: assignments } = useGetAssignmentsQuery();
  const { data: quizMark } = useGetQuizMarkQuery();
  const { data: quizzes } = useGetQuizzesQuery();

  const [selectedVideo, setSelectedVideo] = useState(null);

  // Destructuring in Function Arguments
  const findAssignment = assignments?.find(
    ({ video_id }) => video_id === selectedVideo?.id
  );
  const findAssignmentMark = assignmentMark?.find(
    ({ assignment_id, student_id }) =>
      assignment_id === findAssignment?.id && student_id === auth?.id
  );
  const findQuizMark = quizMark?.find(
    ({ video_id, student_id }) =>
      video_id === selectedVideo?.id && student_id === auth?.id
  );

  // Use Optional Chaining
  const videoQuizzes =
    quizzes?.filter(({ video_id }) => video_id === selectedVideo?.id) ?? [];

  // Avoid Repetition
  useEffect(() => {
    if (videos?.length && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [videos, selectedVideo]);

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-0">
      {videosLoading ? (
        <div className="text-center my-4">Loading...</div>
      ) : videos?.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 lg:gap-8">
          <div className="col-span-full w-full space-y-8 lg:col-span-2">
            <iframe
              width="100%"
              className="aspect-video"
              src={selectedVideo?.url}
              title={selectedVideo?.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-100">
                {selectedVideo?.title}
              </h1>
              <h2 className=" pb-4 text-sm leading-[1.7142857] text-slate-400">
                Uploaded on{' '}
                {selectedVideo &&
                  moment(selectedVideo?.createdAt).format('DD MMMM YYYY')}
              </h2>

              {/* Add assignment modal */}

              <div className="flex gap-4">
                {findAssignment && (
                  <button
                    className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                    // on click
                    disabled={findAssignmentMark ? true : false}
                  >
                    {findAssignmentMark ? 'এসাইনমেন্ট দিয়েছেন' : 'এসাইনমেন্ট'}
                  </button>
                )}

                {findQuizMark ? (
                  <button
                    className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                    disabled
                  >
                    কুইজ দিয়েছেন
                  </button>
                ) : videoQuizzes?.length ? (
                  <Link
                    to={`/quiz/${selectedVideo?.id}`}
                    className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                  >
                    কুইজে অংশগ্রহণ করুন
                  </Link>
                ) : (
                  <button
                    className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
                    disabled
                  >
                    কুইজ নেই
                  </button>
                )}
              </div>
              <p className="mt-4 text-sm text-slate-400 leading-6">
                {selectedVideo?.description}
              </p>
            </div>
          </div>
          <div className="col-span-full lg:col-auto max-h-[570px] overflow-y-auto bg-secondary p-4 rounded-md border border-slate-50/10 divide-y divide-slate-600/30">
            {videos?.map((video) => (
              <div
                className={`w-full flex flex-row gap-2 cursor-pointer hover:bg-slate-900 p-2 py-3 ${
                  video?.id === selectedVideo?.id && 'bg-slate-900'
                }`}
                key={video?.id}
                onClick={() => setSelectedVideo(video)}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                  />
                </svg>
                <div className="flex flex-col w-full">
                  <Link to="#">
                    <p className="text-slate-50 text-sm font-medium">
                      {video?.title}
                    </p>
                  </Link>
                  <div>
                    <span className="text-gray-400 text-xs mt-1">
                      {video?.duration} Mins
                    </span>
                    <span className="text-gray-400 text-xs mt-1"> | </span>
                    <span className="text-gray-400 text-xs mt-1">
                      {video?.views} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center my-4">Video Not Found</div>
      )}
    </div>
  );
}
