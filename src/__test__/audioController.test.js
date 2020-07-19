import {
    setConnection,
    getConnection,
    addAudioFiles,
    play,
    shuffle,
    stop,
    nextSong,
    currentSongName,
    getAudioFiles,
    isShuffled
} from '../audioController';
import validUrl from 'valid-url';
import fs from 'fs';
import { homedir } from 'os';

jest.mock('request', () => {
    return jest.fn(() => ({
        pipe: jest.fn(() => ({
            on: jest.fn((event, callback) => {
                if (event === 'close') {
                    callback();
                }
            })
        }))
    }));
});

describe('Audio Controller', () => {
    let mockConnection, mockIsUri, mockStream;

    beforeEach(() => {
        mockStream = {
            once: jest.fn(),
            end: jest.fn()
        };

        mockConnection = {
            playFile: jest.fn(() => mockStream)
        };
        validUrl.isUri = jest.fn(() => mockIsUri);
        fs.existsSync = jest.fn(() => true);
        fs.readdirSync = jest.fn(() => ['file1.mp3', 'file2.mp3', 'foo.txt']);
        fs.statSync = jest.fn(() => ({
            isDirectory: () => false
        }));
        fs.createWriteStream = jest.fn();
    });

    describe('when connection is set', () => {
        beforeEach(() => {
            setConnection(mockConnection);
        });

        it('should have the correct connection', () => {
            expect(getConnection()).toBe(mockConnection);
        });

        describe('when audio files are added', () => {
            describe('and the location is a URI', () => {
                beforeEach(() => {
                    mockIsUri = true;
                    addAudioFiles('s3://somebucket/file1.mp3');
                });

                it('should add file1', () => {
                    expect(getAudioFiles().get('file1')).toBe(`${homedir}/robit/file1.mp3`);
                });
            });

            describe('and the location is a directory', () => {
                beforeEach(() => {
                    mockIsUri = false;
                    addAudioFiles('/some/directory');
                });

                it('should add file1', () => {
                    expect(getAudioFiles().get('file1')).toBe('/some/directory/file1.mp3');
                });

                it('should add file2', () => {
                    expect(getAudioFiles().get('file2')).toBe('/some/directory/file2.mp3');
                });

                it('should not add foo', () => {
                    expect(getAudioFiles().get('foo')).toBeUndefined();
                });

                describe('when play is called', () => {
                    beforeEach(() => {
                        play();
                    });

                    it('should play the audio', () => {
                        expect(mockConnection.playFile).toHaveBeenCalledWith('/some/directory/file1.mp3');
                    });

                    it('should have the correct song', () => {
                        expect(currentSongName()).toBe('file1');
                    });

                    describe('when next song is invoked', () => {
                        let result;

                        beforeEach(() => {
                            result = nextSong();
                        });

                        it('should stop the current song', () => {
                            expect(mockStream.end).toHaveBeenCalledWith('User invoked next song');
                        });

                        it('should have the correct result', () => {
                            expect(result).toBe(true);
                        });
                    })

                    describe('when shuffle is called', () => {
                        beforeEach(() => {
                            shuffle();
                        });

                        it('should shuffle the music', () => {
                            expect(isShuffled()).toBe(true);
                        });
                    });

                    describe('when stop is called', () => {
                        beforeEach(() => {
                            stop();
                        });

                        it('should stop the audio', () => {
                            expect(mockStream.end).toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
});