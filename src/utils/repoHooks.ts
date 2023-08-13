import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Alert } from 'react-native';
import { GithubApiRepo, ServerRepo, ServerResponse } from '../screens/Home/types';

const displayErrorAlert = () => {
    Alert.alert('There was an error processing your request. Please retry once.')
}

export const useSavedRepos = () => {
    const [savedRepos, setSavedRepos] = useState<ServerRepo[]>([]);

    const getSavedRepos = async () => {
        try {
            const response = await fetch('http://localhost:8080/repo/');
            const data = await response.json() as ServerResponse;
            setSavedRepos(data.repos);
        } catch (error) {
            displayErrorAlert()
        }
    };

    useEffect(() => {
        getSavedRepos();
    }, []);

    return { savedRepos, getSavedRepos };
};

export const useSearchGithubRepos = (setShowDropdown: Dispatch<SetStateAction<boolean>>) => {
    const [searchResults, setSearchResults] = useState<GithubApiRepo[]>([]);

    const searchGithubRepos = async (searchTerm: string) => {
        if (!searchTerm) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${searchTerm}`);
            const data = await response.json();
            setShowDropdown(true);
            setSearchResults(data.items);
        } catch (error) {
            displayErrorAlert()
        }
    };
    return { searchResults, searchGithubRepos };
};

export const useSaveRepo = (
    savedRepos: ServerRepo[],
    selectedRepo: GithubApiRepo | null,
    getSavedRepos: () => Promise<void>
) => {
    const saveRepo = async () => {
        if (savedRepos.length >= 10) {
            Alert.alert("You have reached the limit of 10 saved repositories.");
            return;
        }
        if (selectedRepo) {
            if (savedRepos.some((repo) => repo.id === selectedRepo.id.toString())) {
                Alert.alert("This repository is already saved.");
                return;
            }
            try {
                const payload = {
                    id: selectedRepo.id.toString(),
                    fullName: selectedRepo.full_name,
                    createdAt: selectedRepo.created_at,
                    stargazersCount: selectedRepo.stargazers_count,
                    language: selectedRepo.language,
                    url: selectedRepo.url,
                };
                await fetch('http://localhost:8080/repo/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                await getSavedRepos();

            } catch (error) {
                displayErrorAlert()
            }
        }
    };
    return { saveRepo };
};

export const useDeleteRepo = (getSavedRepos: () => Promise<void>) => {
    const deleteRepo = async (repoID: string) => {
        try {
            await fetch(`http://localhost:8080/repo/${repoID}`, {
                method: 'DELETE'
            });
            await getSavedRepos();
        } catch (error) {
            displayErrorAlert()
        }
    };
    return { deleteRepo };
};
