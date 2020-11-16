const query = `
{
    viewer {
      repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}, affiliations: OWNER) {
        edges {
          node {
            id
            description
            url
            pushedAt
            stargazerCount
            licenseInfo {
              name
            }
            mirrorUrl
            languages(orderBy: {field: SIZE, direction: DESC}, first: 1) {
              nodes {
                color
                name
              }
            }
            name
            isFork
          }
        }
        totalCount
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
  }
`;

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
	//  PROFILE INFORMATION

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

	// REPOSITORY INFORMATION

	repoNumber = document.querySelectorAll(".profile-nav-item")[1].children[1]
		.children[0];
	repoNumber.textContent = profileData.repositories.totalCount;

	const repoCardsContainer = document.querySelector(".repo-cards-container");

	function createRepoCard(repo) {
		const repoCard = document.createElement("div");
		repoCard.classList.add("repo-card");

		const repoCardDetails = document.createElement("div");
		repoCardDetails.classList.add("repo-details");

		const starButton = document.createElement("button");
		starButton.classList.add("btn");
		starButton.classList.add("btn-sm");
		starButton.innerHTML = `
        <svg
								class="octicon octicon-star mr-1"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								height="16"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
								></path>
							</svg>
							Star
        `;

		repoCard.appendChild(repoCardDetails);
		repoCard.appendChild(starButton);

		const repoName = document.createElement("h3");
		repoName.classList.add("repo-name");
		repoName.textContent = repo.name;

		const repoFork = document.createElement("span");
		repo.isFork ? repoFork.classList.add("repo-fork") : null;

		const repoDescription = document.createElement("p");
		repoDescription.classList.add("repo-description");
		repoDescription.textContent = repo.description;

		const repoAdditionalInfo = document.createElement("div");
		repoAdditionalInfo.classList.add("repo-additional-info");

		repoAdditionalInfo.appendChild(document.createElement("span"));
		repoAdditionalInfo.appendChild(document.createElement("span"));
		repoAdditionalInfo.appendChild(document.createElement("span"));
		repoAdditionalInfo.appendChild(document.createElement("span"));

		repoAdditionalInfo.children[0].appendChild(
			document.createElement("span")
		);
		repoAdditionalInfo.children[0].appendChild(
			document.createElement("span")
		);

		repoAdditionalInfo.children[0].children[0].classList.add(
			"repo-language-color"
		);
		repo.languages.nodes.length
			? (repoAdditionalInfo.children[0].children[0].style.backgroundColor = `${repo.languages.nodes[0].color}`)
			: null;
		repo.languages.nodes.length
			? (repoAdditionalInfo.children[0].children[1].textContent =
					repo.languages.nodes[0].name)
			: null;
		repoAdditionalInfo.children[0].children[1].classList.add("language");

		repo.stargazerCount
			? (repoAdditionalInfo.children[1].innerHTML = `
			<svg
				fill="#586069"
				aria-label="fork"
				class="octicon octicon-repo-forked"
				viewBox="0 0 16 16"
				version="1.1"
				width="16"
				height="16"
				role="img"
			>
				<path
					fill-rule="evenodd"
					d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
				></path>
            </svg>`)
			: null;

		repo.licenseInfo
			? (repoAdditionalInfo.children[2].innerHTML = `<svg
        fill="#586069"
        class="octicon octicon-law mr-1"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
    >
        <path
            fill-rule="evenodd"
            d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"
        ></path>
    </svg>
    <span>${repo.licenseInfo.name}</span>
    `)
			: null;

		const oneDay = 24 * 60 * 60 * 1000;
		const diffDays = Math.round(
			Math.abs((new Date() - repo.pushedAt) / oneDay)
		);

		repoAdditionalInfo.children[3].textContent = `Updated ${diffDays} days ago`;

		// repo.languages + repo.licenseInfo + repo.stargazerCount + repo.pushedAt

		repoCardDetails.appendChild(repoName);
		repoCardDetails.appendChild(repoFork);
		repoCardDetails.appendChild(repoDescription);
		repoCardDetails.appendChild(repoAdditionalInfo);

		repoCardsContainer.append(repoCard);
	}

	profileData.repositories.edges.forEach((data) => {
		const repo = data.node;
		createRepoCard(repo);
	});
});
