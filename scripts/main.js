// const query = `{
//     viewer {
//       repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
//         edges {
//           node {
//             id
//             description
//             name
//             url
//             pushedAt
//             stargazerCount
//             forks {
//               totalCount
//             }
//             languages(orderBy: {field: SIZE, direction: DESC}, first: 1) {
//               nodes {
//                 color
//                 name
//               }
//             }
//           }
//         }
//       }
//       avatarUrl
//       bio
//       company
//       name
//       login
//       followers {
//         totalCount
//       }
//       following {
//         totalCount
//       }
//       starredRepositories {
//         totalCount
//       }
//       websiteUrl
//       location
//       email
//     }
//   }`;

// axios({
// 	url: "https://api.github.com/graphql",
// 	method: "post",
// 	headers: {
// 		Authorization: `bearer 7b092251e275873b0d76108e4827af2e1c46bff8`,
// 	},
// 	data: {
// 		query,
// 	},
// }).then((res) => {
// 	console.log(res.data);
// });
