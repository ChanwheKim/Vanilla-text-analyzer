// Load application styles
import 'styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

const VALIDATION = {
    LENGTH_FAILURE : 0,
    CHARACTER_FAILURE : 1,
};

const dataController = (function() {
    const wordsData = {};

    function excludeMeaninglessWords(words) {
        const exclusions = ['is', 'was', 'are', 'were', 'am', 'been', 'at', 'for', 'of', 'on', 'a', 'and', 'this', 'these', 'that', 'those', 'the', 'then', 'it', 'in', 'to', 'as', 'many', 'also', 'with', 'most', 'more', 'because', 'so', 'which', 'they', 'there', 'but', 'though', 'what', 'you', 'i', 'where', 'from', 'other', 'can', 'along', 'by', 'while', 'when', 'such', 'be', 'me', 'its', 'like', 'than', 'their', 'didn\'t', 'would', 'got', 'even', 'haven\'t'];

        return words.filter(function(word) {
            if(word.length !== 0 && !exclusions.includes(word)) {
                if(word.includes('\'')) {
                    word = word.slice(0, word.indexOf('\''));
                }

                return word;
            }
        });
    }

    function removeSpecialCharacters(words) {
        const pureWords = [];

        words.forEach(function(word) {
            let isFirstCharValid = checkCharValidation(word, 'first');
            let isLastCharValid = checkCharValidation(word, 'last');
    
            while(!isFirstCharValid && isFirstCharValid !== undefined) {
                word = word.substr(1);
                isFirstCharValid = checkCharValidation(word, 'first');
            }
        
            while(!isLastCharValid && isLastCharValid !== undefined) {
                word = word.substr(0, word.length - 1);
                isLastCharValid = checkCharValidation(word, 'last');
            }

            if(word !== '') {
                pureWords.push(word);
            }
        });

        return pureWords;
    }

    function checkCharValidation(word, firstOrLast) {
        if(word) {
            let characterCode;
    
            if(firstOrLast === 'first') {
                characterCode = word[0].charCodeAt();
            } else if(firstOrLast === 'last') {
                characterCode = word[word.length - 1].charCodeAt();
            }
    
            return (characterCode >= 65 && characterCode <= 90) ||
                   (characterCode >= 97 && characterCode <= 122) ||
                   (characterCode >= 48 && characterCode <= 57);
        }
    }

    function spliltTexts(texts) {
        while(texts.includes('\n')) {
            texts = texts.replace('\n', ' ');
        }

        return texts.toLowerCase().split(' ');
    }

    return {
        filterWords : function(texts) {
            const splittedTexts = spliltTexts(texts);
            const pureWords = removeSpecialCharacters(splittedTexts);
            const meaningfulWords = excludeMeaninglessWords(pureWords);

            return meaningfulWords;
        },

        saveWords : function(words) {
            words.forEach(function(word) {
                if(wordsData[word] !== undefined) {
                    wordsData[word].count++;
                } else {
                    wordsData[word] = { count : 1 };
                }
            });
        },

        clearPreviousDataHistory : function(updatedWords) {
            for(let word in wordsData) {
                if(!updatedWords.includes(word)) {
                    delete wordsData[word];
                } else {
                    wordsData[word].count = 0;
                }
            }
        },

        determineLevel : function() {
            for(let word in wordsData) {
                const count = wordsData[word].count;
                if(count >= 5) {
                    wordsData[word].level = 5;
                } else if(count === 4) {
                    wordsData[word].level = 4;
                } else if(count === 3) {
                    wordsData[word].level = 3;
                } else if(count === 2) {
                    wordsData[word].level = 2;
                } else if(count === 1) {
                    wordsData[word].level = 1;
                }
            }
        },

        findHighFrequencyWords : function() {
            const highFrequencyWords = [];
            const words = Object.keys(wordsData).sort(function(a, b) {
                return wordsData[b].count - wordsData[a].count;
            }).slice(0, 10);

            words.forEach(function(word) {
                highFrequencyWords.push({
                    name : word,
                    count : wordsData[word].count,
                    level : wordsData[word].level,
                });
            });

            return highFrequencyWords;
        },

        checkInputStringValid : function(texts) {
            return texts.split('').every(function(char) {
                return char.charCodeAt() >= 0 && char.charCodeAt() <= 126;
            });
        },

        getData : function() {
            return wordsData;
        },
    };
})();


const uiController = (function() {
    const selectors = {
        textEditor : '.analyzer__text-editor',
        cloud : '.word-cloud',
        topWords : '.top-words',
        topWordsList : '.top-words__list',
        mainTitle : '.main-title',
        panel : '.analyzer__panel',
        btnView : '.btn-view-change',
        alertLabel : '.alert-display',
    };
    let angleAddition = 50;

    return {
        displayClouds : function(wordsData) {
            const cloud = document.querySelector(selectors.cloud);
            let idx = 0;

            cloud.classList.add('display-block');
            cloud.innerHTML = '';

            for(let word in wordsData) {
                const cloudElement = document.createElement('li');

                cloudElement.textContent = word;
                cloudElement.classList.add('cloud-element');
                cloudElement.classList.add('level-' + wordsData[word].level);
                cloudElement.id = idx;
                cloudElement.dataset.count = 'count : ' + wordsData[word].count;
                cloud.classList.add('border-none');
                cloud.appendChild(cloudElement);
                idx++;
            }
        },

        changeViews : function() {
            const displayPanel = document.querySelector(selectors.panel);
            const title = document.querySelector(selectors.mainTitle);
            const wordNumbers = document.querySelector(selectors.cloud).children.length;
            const left = 900 * .5;
            const top = 350 * .5;
            let radiusX = 10;
            let radiusY = 60;
            let angle = 0;
            let id = 0;

            displayPanel.classList.add('add-margin');

            for(let i = id; i < wordNumbers; i++) {
                const cloudWord = document.getElementById(i);

                cloudWord.classList.add('position-absolute');
                cloudWord.style.left = left + (Math.sin(angle) * radiusX)+'px';
                cloudWord.style.top = top + (Math.cos(angle) * radiusY)+'px';

                radiusX += 5;
                radiusY += 2;
                angle += angleAddition;
            }

            angleAddition += 10;
            title.classList.add('inactive');
        },

        displayTopWords : function(words) {
            const listContainer = document.querySelector(selectors.topWords);
            const lists = document.querySelector(selectors.topWordsList);
            const topWords = document.createDocumentFragment();

            lists.innerHTML = '';

            words.forEach(function(word) {
                const topWord = document.createElement('li');

                topWord.textContent = word.name;
                topWord.className = 'top-word';
                topWord.classList.add(`top-word-level-${word.level}`);
                topWords.appendChild(topWord);
            });

            listContainer.classList.remove('inactive');
            lists.appendChild(topWords);
        },

        getInputText : function() {
            return document.querySelector(selectors.textEditor).value;
        },

        getSelectorString : function() {
            return selectors;
        },

        displayAlert : function(type) {
            const alertLabel = document.querySelector(selectors.alertLabel);

            if(type === VALIDATION.LENGTH_FAILURE) {
                alertLabel.textContent = 'Character length is 5,000.';
            }

            if(type === VALIDATION.CHARACTER_FAILURE) {
                alertLabel.textContent = 'Sorry, English is only accepted..!';
            }

            alertLabel.classList.add('active');
            document.querySelector(selectors.textEditor).classList.add('alert-character');
        },

        displayCharacterAlert : function() {
            document.querySelector(selectors.alertLabel).classList.add('active');
            document.querySelector(selectors.textEditor).classList.add('alert-character');
        },

        clearAlertLabel : function() {
            document.querySelector(selectors.textEditor).classList.remove('alert-character');
            document.querySelector(selectors.alertLabel).classList.remove('active');
        },
    };
})();


const appController = (function(dataCtrl, uiCtrl) {
    const selectors = uiCtrl.getSelectorString();
    let wasCharacterValid = true;
    let isInvalidTextLength = false;

    document.querySelector(selectors.btnView).addEventListener('click', uiCtrl.changeViews);
    document.querySelector(selectors.textEditor).addEventListener('keyup', function(ev) {
        const texts = uiCtrl.getInputText();

        if(texts.length > 5000) {
            uiCtrl.displayAlert(VALIDATION.LENGTH_FAILURE);
            isInvalidTextLength = true;
            return;
        } else if(isInvalidTextLength){
            isInvalidTextLength = false;
            uiCtrl.clearAlertLabel();
        }

        if(wasCharacterValid) {
            const isValidCharacter = ev.key.charCodeAt() >= 0 && ev.key.charCodeAt() <= 126;

            if(isValidCharacter) {
                ctrlInputTexts();
            } else {
                wasCharacterValid = false;
                uiCtrl.displayAlert(VALIDATION.CHARACTER_FAILURE);
            }
        } else {
            wasCharacterValid = dataCtrl.checkInputStringValid(texts);
            
            if(wasCharacterValid) {
                uiCtrl.clearAlertLabel();
            }
        }
    });

    function ctrlInputTexts() {
        const texts = uiCtrl.getInputText();
        const meaningfulWords = dataCtrl.filterWords(texts);
        let updatedWords;
        let topWords;

        dataCtrl.clearPreviousDataHistory(meaningfulWords);
        dataCtrl.saveWords(meaningfulWords);
        dataCtrl.determineLevel();

        updatedWords = dataCtrl.getData();
        uiCtrl.displayClouds(updatedWords);
        
        topWords = dataCtrl.findHighFrequencyWords();
        uiCtrl.displayTopWords(topWords);
    }
})(dataController, uiController);
