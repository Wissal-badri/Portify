// GitHub API Service
const GITHUB_USERNAME = 'Wissal-badri';
const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    fork: boolean;
    topics: string[];
    created_at: string;
    updated_at: string;
}

export interface GitHubUser {
    login: string;
    name: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    avatar_url: string;
}

export interface GitHubStats {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    followers: number;
    following: number;
    publicGists: number;
}

// Fetch user profile
export const fetchGitHubUser = async (): Promise<GitHubUser> => {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
    if (!response.ok) {
        throw new Error('Failed to fetch GitHub user');
    }
    return response.json();
};

// Fetch all repositories
export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
    const response = await fetch(
        `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch GitHub repositories');
    }
    return response.json();
};

// Calculate GitHub stats
export const calculateGitHubStats = async (): Promise<GitHubStats> => {
    const [user, repos] = await Promise.all([
        fetchGitHubUser(),
        fetchGitHubRepos(),
    ]);

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    return {
        totalRepos: user.public_repos,
        totalStars,
        totalForks,
        followers: user.followers,
        following: user.following,
        publicGists: 0, // GitHub API v3 doesn't include this in user endpoint
    };
};

// Get featured repositories (top 6 by stars and recent updates)
export const getFeaturedRepos = async (limit: number = 6): Promise<GitHubRepo[]> => {
    const repos = await fetchGitHubRepos();

    // Filter out forks and sort by stars and update date
    const filteredRepos = repos
        .filter((repo) => !repo.fork)
        .sort((a, b) => {
            // Prioritize by stars, then by update date
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

    return filteredRepos.slice(0, limit);
};

// Map GitHub repo to Project interface
export const mapRepoToProject = (repo: GitHubRepo, index: number) => {
    // Generate a placeholder image based on the language
    const getLanguageImage = (language: string | null) => {
        const languageImages: { [key: string]: string } = {
            JavaScript: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
            TypeScript: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80',
            Python: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
            Java: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
            HTML: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
            CSS: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
            Dart: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
        };
        return languageImages[language || ''] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
    };

    return {
        id: repo.id,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        description: repo.description || 'A project built with passion and dedication.',
        technologies: [
            repo.language || 'Code',
            ...repo.topics.slice(0, 3),
        ].filter(Boolean),
        image: getLanguageImage(repo.language),
        github: repo.html_url,
        live: repo.homepage || undefined,
    };
};
