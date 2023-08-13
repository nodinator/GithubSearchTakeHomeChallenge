export interface ServerRepo {
    id: string;
    fullName: string;
    createdAt: string;
    stargazersCount: number;
    language: string;
    url: string;
}

export interface ServerResponse {
    repos: ServerRepo[]
}

export interface GithubApiRepo {
    id: string;
    name: string;
    full_name: string;
    description: string;
    created_at: Date;
    stargazers_count: number;
    language: string;
    url: string;
}
