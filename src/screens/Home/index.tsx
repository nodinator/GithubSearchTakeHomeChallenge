import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, Pressable, View, } from 'react-native';
import { GithubApiRepo } from './types';
import { debounce, insetCalc, processShortName } from '../../utils/utils';
import { useSavedRepos, useDeleteRepo, useSaveRepo, useSearchGithubRepos } from '../../utils/repoHooks';
import colors from '../../styles/colors';

const SORT_OPTIONS = {
  NAME: 'name',
  STARS: 'stargazers_count',
};
type SortOptionType = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

export const Home = () => {
  const insets = useSafeAreaInsets();
  const style = useMemo(() => insetCalc(insets), [insets]);

  const [selectedRepo, setSelectedRepo] = useState<GithubApiRepo | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<SortOptionType>(SORT_OPTIONS.NAME);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [selectedSaved, setSelectedSaved] = useState<string | null>(null);

  const { savedRepos, getSavedRepos } = useSavedRepos();
  const { searchResults, searchGithubRepos } = useSearchGithubRepos(setShowDropdown);
  const { saveRepo } = useSaveRepo(savedRepos, selectedRepo, getSavedRepos)
  const { deleteRepo } = useDeleteRepo(getSavedRepos)

  const debouncedSearchGithubRepos = useCallback(
    debounce((term) => searchGithubRepos(term), 500),
    []
  );

  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    debouncedSearchGithubRepos(debouncedSearchTerm);
  }, [debouncedSearchTerm, debouncedSearchGithubRepos]);

  const sortedSavedRepos = useMemo(() => {
    if (sortOrder === SORT_OPTIONS.NAME) {
      return [...savedRepos].sort((a, b) => processShortName(a.fullName).localeCompare(processShortName(b.fullName)));
    } else if (sortOrder === SORT_OPTIONS.STARS) {
      return [...savedRepos].sort((a, b) => b.stargazersCount - a.stargazersCount);
    } else {
      return savedRepos;
    }
  }, [savedRepos, sortOrder]);

  useEffect(() => {
    getSavedRepos();
  }, []);

  const handleSearchSelection = (repo: GithubApiRepo) => {
    setSelectedRepo(repo);
    setSearchTerm('')
    setShowDropdown(false);
  };

  const handleSavedRepoPress = (repoId: string) => {
    setSelectedSaved(selectedSaved === repoId ? null : repoId);
  };

  return (
    <View style={{ flex: 1, ...style, backgroundColor: colors.offWhite }}>
      <Text style={styles.heading}>Search GitHub Repositories:</Text>
      <TextInput
        style={styles.searchInput}
        placeholderTextColor={colors.grayBorder}
        placeholder='Search...'
        autoCapitalize='none'
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text);
        }}
        onBlur={() => setShowDropdown(false)}
      />
      {showDropdown && (
        <View style={styles.dropdown}>
          {searchResults.length > 0 ? (
            (searchResults.map((repo) => (
              <Pressable
                key={repo.id}
                style={styles.dropdownItem}
                onPress={() => handleSearchSelection(repo)}
              >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={{ fontWeight: 'bold' }}>{repo.name}</Text>
                  <Text>{` - ${repo.stargazers_count} stars - `}</Text>
                  <Text>{repo.language ? repo.language : 'unspecified language'}</Text>
                </View>
                <Text>{repo.description}</Text>
              </Pressable>
            )))
          ) : (
            <Text style={{ padding: 10 }}>No repositories found</Text>
          )}
        </View>
      )}
      {selectedRepo && (
        <View >
          <View style={styles.selectedRepo}>
            <Text>{selectedRepo.full_name}</Text>
            <Text>{selectedRepo.language ? selectedRepo.language : 'unspecified language'}</Text>
            <Text>{selectedRepo.stargazers_count} stars</Text>
          </View>

          <Pressable onPress={() => {
            saveRepo()
            setSelectedRepo(null)
          }}
            style={({ pressed }) => [
              styles.pressableMain,
              { backgroundColor: colors.blue, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.pressableText}>Save Repository</Text>
          </Pressable>
        </View>
      )}

      <View style={{ flex: 1 }}>

        <Text style={[styles.heading, { marginTop: 20, }]}>Saved Repositories:</Text>
        <View style={{
          flexDirection: 'row', gap: 10, paddingBottom: 10, alignItems: 'center',
        }}>
          <Text>Sort by:</Text>
          <Pressable
            style={[styles.pressableSorting, { opacity: sortOrder === SORT_OPTIONS.NAME ? 1 : 0.7 }]}
            onPress={() => setSortOrder(SORT_OPTIONS.NAME)}>
            <Text style={styles.pressableText}>Name</Text>
          </Pressable>
          <Pressable
            style={[styles.pressableSorting, { opacity: sortOrder === SORT_OPTIONS.STARS ? 1 : 0.7 }]}
            onPress={() => setSortOrder(SORT_OPTIONS.STARS)}>
            <Text style={styles.pressableText}>Stars</Text>
          </Pressable>
        </View>
        {sortedSavedRepos.length > 0 ? (
          <ScrollView>
            {sortedSavedRepos.map((repo) => (
              <Pressable
                key={repo.id} style={{ marginVertical: 10 }}
                onPress={() => handleSavedRepoPress(repo.id)}
              >
                <Text style={{ fontWeight: selectedSaved === repo.id ? 'bold' : 'normal' }}>
                  {processShortName(repo.fullName)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{`${repo.stargazersCount} stars - `}</Text>
                  <Text>{repo.language ? repo.language : 'unspecified language'}</Text>
                </View>

                {selectedSaved === repo.id &&
                  <View>
                    <Text>{repo.fullName}</Text>
                    <Text>{repo.url}</Text>
                    <Text>{`created on ${new Date(repo.createdAt).toLocaleString()}`}</Text>
                    <Pressable
                      onPress={() => deleteRepo(repo.id)}
                      style={({ pressed }) => [
                        styles.pressableMain,
                        { backgroundColor: colors.red, opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <Text style={styles.pressableText}>Delete</Text>
                    </Pressable>
                  </View>}
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <Text>No saved repositories</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: colors.grayBorder,
    backgroundColor: colors.white
  },
  dropdownItem: {
    padding: 10,
    borderColor: colors.grayBorder,
    borderBottomWidth: 1
  },
  heading: {
    fontSize: 16,
    marginBottom: 15,
  },
  pressableMain: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    alignItems: 'center'
  },
  pressableSorting: {
    backgroundColor: colors.grayButton,
    borderRadius: 8
  },
  pressableText: {
    fontWeight: 'bold',
    color: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,

  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.grayBorder,
    borderRadius: 4,
    backgroundColor: colors.white,
    padding: 8,
    fontSize: 14,
  },
  selectedRepo: {
    backgroundColor: colors.white,
    borderColor: colors.grayBorder,
    borderWidth: 1,
    marginVertical: 10,
    padding: 4
  }
});
