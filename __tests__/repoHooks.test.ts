import { renderHook, act } from '@testing-library/react-hooks';
import { useSavedRepos, useSearchGithubRepos, useSaveRepo, useDeleteRepo } from '../src/utils/repoHooks';
import { ServerRepo, GithubApiRepo } from '../src/screens/Home/types';

global.fetch = jest.fn();

const mockServerRepo: ServerRepo = {
    id: '1234567',
    fullName: 'testrepo',
    createdAt: '2011-01-26T19:01:12.000Z',
    stargazersCount: 900,
    language: 'Java',
    url: 'https://api.github.com/users/octocat/testrepo'
}
const mockSelectedRepo: GithubApiRepo = {
    id: '2',
    name: 'newrepo',
    full_name: 'newrepo',
    description: 'This is a new repo for testing purposes.',
    created_at: new Date('2020-01-01T00:00:00Z'),
    stargazers_count: 100,
    language: 'JavaScript',
    url: 'https://api.github.com/users/octocat/newrepo',
}

describe('useSavedRepos', () => {
    it('fetches saved repositories', async () => {
        const data = { repos: [mockServerRepo] };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(data)
        });

        const { result, waitForNextUpdate } = renderHook(() => useSavedRepos());
        await waitForNextUpdate();

        expect(result.current.savedRepos).toEqual(data.repos);
    });
});

describe('useSearchGithubRepos', () => {
    it('searches GitHub repositories', async () => {
        const data = { items: [mockServerRepo] };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(data)
        });

        const setShowDropdown = jest.fn();
        const { result, waitForNextUpdate } = renderHook(() => useSearchGithubRepos(setShowDropdown));

        act(() => {
            result.current.searchGithubRepos('testrepo');
        });

        await waitForNextUpdate();

        expect(result.current.searchResults).toEqual(data.items);
        expect(setShowDropdown).toHaveBeenCalledWith(true);
    });
});

describe('useSaveRepo', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('saves a new repository if under the limit and not already saved', async () => {
        const savedRepos = [mockServerRepo]
        const selectedRepo = mockSelectedRepo;
        const expectedPostShape = {
            id: '2',
            fullName: 'newrepo',
            createdAt: '2020-01-01T00:00:00.000Z',
            stargazersCount: 100,
            language: 'JavaScript',
            url: 'https://api.github.com/users/octocat/newrepo'
        }

        const getSavedRepos = jest.fn();

        const { result } = renderHook(() => useSaveRepo(savedRepos, selectedRepo, getSavedRepos));

        await act(() => result.current.saveRepo());

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/repo/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expectedPostShape)
        });

        expect(getSavedRepos).toHaveBeenCalledTimes(1);
    });

    it('does not save a repository if it is already saved', async () => {
        const test_id = '1234567'
        const savedRepos = [{
            id: test_id,
            fullName: 'testrepo',
            createdAt: '2011-01-26T19:01:12.000Z',
            stargazersCount: 900,
            language: 'Java',
            url: 'https://api.github.com/users/octocat/testrepo'
        }]
        const selectedRepo = {
            id: test_id,
            name: 'testrepo',
            full_name: 'testrepo',
            description: 'This is a new repo for testing purposes.',
            stargazers_count: 900,
            language: 'Java',
            url: 'https://api.github.com/users/octocat/testrepo',
            created_at: new Date('2011-01-26T19:01:12Z'),
        };

        const getSavedRepos = jest.fn();

        const { result } = renderHook(() => useSaveRepo(savedRepos, selectedRepo, getSavedRepos));

        await act(() => result.current.saveRepo());

        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('does not save a repository if there are already 10 saved', async () => {
        const savedRepos = Array(10).fill({ mockServerRepo });

        const getSavedRepos = jest.fn();

        const { result } = renderHook(() => useSaveRepo(savedRepos, mockSelectedRepo, getSavedRepos));

        await act(() => result.current.saveRepo());

        expect(global.fetch).not.toHaveBeenCalled();
    });
});

describe('useDeleteRepo', () => {
    it('deletes a repository and refreshes the saved repos', async () => {
        const repoID = '1234567';
        const getSavedRepos = jest.fn();

        (global.fetch as jest.Mock).mockResolvedValueOnce({});

        const { result } = renderHook(() => useDeleteRepo(getSavedRepos));

        await act(() => result.current.deleteRepo(repoID));

        expect(global.fetch).toHaveBeenCalledWith(`http://localhost:8080/repo/${repoID}`, {
            method: 'DELETE'
        });
        expect(getSavedRepos).toHaveBeenCalledTimes(1);
    });
});