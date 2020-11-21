const githubUsername = "john-afolabi";
const githubToken = "736703e507e3f775c1d46e2fdd4c60ccb5bedc79";

const query = ` {
	user(login: "${githubUsername}") {
		avatarUrl
		bio
		email
		followers {
		  totalCount
		}
		following {
		  totalCount
		}
		location
		login
		name
		websiteUrl
		repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}, affiliations: OWNER) {
		  edges {
			node {
			  id
			  description
			  name
			  parent {
				nameWithOwner
				forkCount
			  }
			  licenseInfo {
				name
			  }
			  languages(orderBy: {field: SIZE, direction: DESC}, first: 1) {
				edges {
				  node {
					color
					name
				  }
				}
			  }
			  pushedAt
			}
		  }
		  totalCount
		}
		starredRepositories {
		  totalCount
		}
  }
}
`;

async function getProfileData() {
	try {
		const res = await axios({
			url: "https://api.github.com/graphql",
			method: "post",
			headers: {
				Authorization: `bearer ${githubToken}`,
			},
			data: {
				query,
			},
		});
		console.log(res.data.data.user);
		return res.data.data.user;
	} catch (error) {
		console.log(error);
	}
}

getProfileData().then((profileData) => {
	//  PROFILE INFORMATION

	const profileAvatar = document.querySelector(".profile-avatar");
	profileAvatar.src = profileData.avatarUrl;

	const navAvatar = document.querySelector(".nav-profile-img");
	navAvatar.src = profileData.avatarUrl;

	const mobileNavAvatar = document.querySelector(".mobile-nav-avatar");
	mobileNavAvatar.src = profileData.avatarUrl;

	const mobileNavUsername = document.querySelectorAll(".mobile-nav-item")[8];
	mobileNavUsername.append(profileData.login);

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
		repo.parent ? repoFork.classList.add("repo-fork") : null;
		repo.parent
			? (repoFork.textContent = `Forked from ${repo.parent.nameWithOwner}`)
			: null;

		const repoDescription = document.createElement("p");
		repoDescription.classList.add("repo-description");
		repoDescription.textContent = repo.description;

		const repoAdditionalInfo = document.createElement("div");
		repoAdditionalInfo.classList.add("repo-additional-info");

		// repoAdditionalInfo.appendChild(document.createElement("span"));
		// repoAdditionalInfo.appendChild(document.createElement("span"));
		// repoAdditionalInfo.appendChild(document.createElement("span"));
		// repoAdditionalInfo.appendChild(document.createElement("span"));

		const additionalInfos =
			!!repo.languages.edges.length +
			!!repo.parent +
			!!repo.licenseInfo +
			!!repo.pushedAt;
		for (let index = 0; index < additionalInfos + 1; index++) {
			repoAdditionalInfo.appendChild(document.createElement("span"));
		}

		repoAdditionalInfo.children[0].appendChild(
			document.createElement("span")
		);
		repoAdditionalInfo.children[0].appendChild(
			document.createElement("span")
		);

		repoAdditionalInfo.children[0].children[0].classList.add(
			"repo-language-color"
		);
		repo.languages.edges.length
			? (repoAdditionalInfo.children[0].children[0].style.backgroundColor = `${repo.languages.edges[0].node.color}`)
			: null;
		repo.languages.edges.length
			? (repoAdditionalInfo.children[0].children[1].textContent =
					repo.languages.edges[0].node.name)
			: null;
		repoAdditionalInfo.children[0].children[1].classList.add("language");

		repo.forkCount || repo.parent
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
            </svg> ${repo.forkCount || repo.parent.forkCount}`)
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

		const a = moment(repo.pushedAt);
		const b = moment();

		const dayDiff = b.diff(a, "days");

		const repoCardDate =
			dayDiff < 30
				? `Updated ${dayDiff} days ago`
				: `Updated on ${a.format("MMM D")}`;

		repoAdditionalInfo.children[
			repoAdditionalInfo.children.length - 1
		].textContent = repoCardDate;

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

const mediaQuery = window.matchMedia("(max-width: 1012px)");

function handleTabletChange(e) {
	const pullRequests = document.querySelector(".nav-items").children[0]
		.children[0];
	if (e.matches) {
		pullRequests.textContent = "Pulls";
	} else {
		pullRequests.textContent = "Pull requests";
	}
}

mediaQuery.addListener(handleTabletChange);
handleTabletChange(mediaQuery);

const mobileNav = document.querySelector(".mobile-nav");

const openNav = () => {
	if (mobileNav.classList.contains("open-mobile-nav")) {
		mobileNav.classList.remove("open-mobile-nav");
	} else {
		mobileNav.classList.add("open-mobile-nav");
	}
};

document.querySelector(".hamburger").onclick = openNav;
