import useAuth from '../../hooks/useAuth';
import { useGetAssignmentMarkQuery } from '../../redux/features/assignmentMark/assignmentMarkApi';
import { useGetQuizMarkQuery } from '../../redux/features/quizMark/quizMarkApi';
import { useGetUsersQuery } from '../../redux/features/users/usersApi';

export default function LeaderBoard() {
  const auth = useAuth();
  const { data: assignmentMark } = useGetAssignmentMarkQuery();
  const { data: quizMark } = useGetQuizMarkQuery();
  const {
    data: users,
    isLoading: userLoading,
    isError: userIsError,
    error: userError,
  } = useGetUsersQuery();

  const usersData = users
    ?.map((user) => {
      const assignment =
        assignmentMark
          ?.filter((assignmentMark) => assignmentMark?.student_id === user?.id)
          ?.reduce((acc, curr) => acc + curr?.mark, 0) || 0;

      const quiz =
        quizMark
          ?.filter((quiz) => quiz?.student_id === user?.id)
          ?.reduce((acc, curr) => acc + curr?.mark, 0) || 0;

      const totalMark = parseInt(parseInt(assignment) + parseInt(quiz));

      return {
        ...user,
        assignmentMark: parseInt(assignment),
        quizMark: parseInt(quiz),
        totalMark,
      };
    })
    ?.sort((a, b) => {
      if (a?.totalMark > b?.totalMark) {
        return -1;
      } else if (b?.totalMark > a?.totalMark) {
        return 1;
      }

      return 1;
    });

  const authUserData = usersData?.find((user) => user?.id === auth?.id);

  const findRanking = (user) => {
    const rank = usersData?.findIndex(
      (item) => item?.totalMark === user?.totalMark
    );

    if (rank === 0) {
      return '🥇';
    } else {
      return rank + 1;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-0">
      {userLoading ? (
        <div className="text-center my-4">Loading...</div>
      ) : userIsError ? (
        <div className="text-center my-4">
          {userError?.data || 'Error Found'}
        </div>
      ) : usersData?.length > 0 ? (
        <>
          <div>
            <h3 className="text-lg font-bold">Your Position in Leaderboard</h3>
            <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
              <thead>
                <tr>
                  <th className="table-th !text-center">Rank</th>
                  <th className="table-th !text-center">Name</th>
                  <th className="table-th !text-center">Quiz Mark</th>
                  <th className="table-th !text-center">Assignment Mark</th>
                  <th className="table-th !text-center">Total</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-2 border-cyan">
                  <td className="table-td text-center font-bold">
                    {usersData?.findIndex(
                      (item) => item?.totalMark === authUserData?.totalMark
                    ) + 1}
                  </td>
                  <td className="table-td text-center font-bold">
                    {authUserData?.name}
                  </td>
                  <td className="table-td text-center font-bold">
                    {authUserData?.quizMark}
                  </td>
                  <td className="table-td text-center font-bold">
                    {authUserData?.assignmentMark}
                  </td>
                  <td className="table-td text-center font-bold">
                    {authUserData?.totalMark}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="my-8">
            <h3 className="text-lg font-bold">Top 20 Result</h3>
            <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
              <thead>
                <tr className="border-b border-slate-600/50">
                  <th className="table-th !text-center">Rank</th>
                  <th className="table-th !text-center">Name</th>
                  <th className="table-th !text-center">Quiz Mark</th>
                  <th className="table-th !text-center">Assignment Mark</th>
                  <th className="table-th !text-center">Total</th>
                </tr>
              </thead>

              <tbody>
                {usersData?.map((user) => (
                  <tr className="border-b border-slate-600/50" key={user?.id}>
                    <td className="table-td text-center">
                      {findRanking(user)}
                    </td>
                    <td className="table-td text-center">{user?.name}</td>
                    <td className="table-td text-center">{user?.quizMark}</td>
                    <td className="table-td text-center">
                      {user?.assignmentMark}
                    </td>
                    <td className="table-td text-center">{user?.totalMark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center my-4">User Not Found</div>
      )}
    </div>
  );
}
