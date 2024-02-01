// import { useQuery } from '@redwoodjs/web'

// import ThreadCard from '../ThreadCard/ThreadCard'; // A component to render each thread's info

// const LIST_THREADS_QUERY = gql`
//   query ListThreadsQuery($assistantId: String!) {
//     listThreads(assistantId: $assistantId) {
//       id
//       object
//       created_at
//       thread_id
//       role
//       content
//       file_ids
//       metadata
//     }
//   }
// `

// const ThreadList = ({ assistantId, onThreadSelect }) => {
//   const { data, loading, error } = useQuery(LIST_THREADS_QUERY, {
//     variables: { assistantId },
//   })

//   if (loading) return 'Loading...'
//   if (error) return `Error: ${error.message}`

//   return (
//     <div>
//       {data.listThreads.map((thread) => (
//         <ThreadCard key={thread.id} thread={thread} onSelect={onThreadSelect} />
//       ))}
//     </div>
//   )
// }

// export default ThreadList
