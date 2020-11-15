const query = `{
    viewer {
      repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
        edges {
          node {
            id
            description
            name
            url
            pushedAt
            stargazerCount
            forks {
              totalCount
            }
            languages(orderBy: {field: SIZE, direction: DESC}, first: 1) {
              nodes {
                color
                name
              }
            }
          }
        }
      }
      avatarUrl
      bio
      company
      name
      login
      followers {
        totalCount
      }
      following {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      websiteUrl
      location
      email
    }
  }`;

// axios({
// 	url: "https://api.github.com/graphql",
// 	method: "post",
// 	headers: {
// 		Authorization: `bearer 7b092251e275873b0d76108e4827af2e1c46bff8`,
// 	},
// 	data: {
// 		query,
// 	},
// })
// 	.then((res) => {
// 		profileData = res.data.data.viewer;
// 		return profileData;
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

async function getProfileData() {
	try {
		const res = await axios({
			url: "https://api.github.com/graphql",
			method: "post",
			headers: {
				Authorization: `bearer 7b092251e275873b0d76108e4827af2e1c46bff8`,
			},
			data: {
				query,
			},
		});
		console.log(res.data.data.viewer);
		return res.data.data.viewer;
	} catch (error) {
		console.log(error);
	}
}

getProfileData().then((profileData) => {
	const profileAvatar = document.querySelector(".profile-avatar");
	profileAvatar.src = profileData.avatarUrl;

	const fullname = document.querySelector(".full-name");
	fullname.textContent = profileData.name;

	const username = document.querySelector(".username");
	username.textContent = profileData.login;

	const bio = document.querySelector(".bio");
	bio.textContent = profileData.bio;

	const profileStat = document.querySelector(".profile-stat");
	profileStat.children[0].append(
		`${profileData.followers.totalCount} followers`
	);

	profileStat.children[1].append(
		`${profileData.following.totalCount} following`
	);

	profileStat.children[2].append(
		`${profileData.starredRepositories.totalCount}`
	);

	const moreDetails = document.querySelector(".more-details");
	moreDetails.children[0].append(`${profileData.location}`);
	moreDetails.children[1].append(`${profileData.email}`);
	moreDetails.children[2].append(`${profileData.websiteUrl}`);
});
