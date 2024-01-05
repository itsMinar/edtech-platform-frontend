import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useEditAssignmentMarkMutation,
  useGetAssignmentMarkQuery,
} from '../../redux/features/assignmentMark/assignmentMarkApi';

export default function AssignmentMark() {
  const [mark, setMark] = useState([]);
  const {
    isLoading,
    isError,
    error,
    data: assignmentMark,
  } = useGetAssignmentMarkQuery();
  const [editAssignmentMark] = useEditAssignmentMarkMutation();

  const assignmentPending = assignmentMark?.filter(
    (item) => item.status === 'pending'
  );

  useEffect(() => {
    if (assignmentMark?.length) {
      setMark([...assignmentMark]);
    }
  }, [assignmentMark]);

  const handleMarkChange = (e, idx) => {
    const selectedMark = mark?.map((item, index) => {
      if (idx === index) {
        return { ...item, mark: e.target.value };
      } else {
        return item;
      }
    });

    setMark(selectedMark);
  };

  const handleAddMark = (idx, id) => {
    if (mark[idx]?.mark === '') {
      return toast.warning('Please fill-up mark');
    }

    if (mark[idx]?.mark < 0 || mark[idx]?.mark > mark[idx]?.totalMark) {
      return toast.warning('Please enter valid mark');
    }

    editAssignmentMark({
      data: {
        mark: Number(mark[idx]?.mark),
        status: 'published',
      },
      id,
    });
  };

  return (
    <div className="mx-auto max-w-full px-5 lg:px-20">
      {isLoading ? (
        <div className="py-20 text-center">Loading...</div>
      ) : isError ? (
        <div className="py-20 text-center">
          {error?.data || 'Assignment get fail!'}
        </div>
      ) : assignmentMark?.length > 0 ? (
        <div className="px-3 py-20 bg-opacity-10">
          <ul className="assignment-status">
            <li>
              Total <span>{assignmentMark?.length}</span>
            </li>
            <li>
              Pending <span>{assignmentPending?.length}</span>
            </li>
            <li>
              Mark Sent{' '}
              <span>{assignmentMark?.length - assignmentPending?.length}</span>
            </li>
          </ul>
          <div className="overflow-x-auto mt-4">
            <table className="divide-y-1 text-base divide-gray-600 w-full">
              <thead>
                <tr>
                  <th className="table-th">Assignment</th>
                  <th className="table-th">Date</th>
                  <th className="table-th">Student Name</th>
                  <th className="table-th">Repo Link</th>
                  <th className="table-th">Mark</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-600/50">
                {assignmentMark?.map((assignment, idx) => (
                  <tr key={assignment?.id}>
                    <td className="table-td">{assignment?.title}</td>
                    <td className="table-td">
                      {moment(assignment?.createdAt).format(
                        'DD MMMM YYYY hh:mm:ss A'
                      )}
                    </td>
                    <td className="table-td">{assignment?.student_name}</td>
                    <td className="table-td">{assignment?.repo_link}</td>

                    {assignment?.status === 'pending' ? (
                      <td className="table-td input-mark">
                        <input
                          min={1}
                          max={assignment?.totalMark}
                          value={mark[idx]?.mark || ''}
                          onChange={(e) => {
                            handleMarkChange(e, idx);
                          }}
                        />
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-6 h-6 text-green-500 cursor-pointer hover:text-green-400"
                          onClick={() => handleAddMark(idx, assignment?.id)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </td>
                    ) : (
                      <td className="table-td">{assignment?.mark}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">Data not Found</div>
      )}
    </div>
  );
}
