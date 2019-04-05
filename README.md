# Vanilla-text-analyzer

## Introduction
사용자가 텍스트를 입력하면, 단어를 분석해 시각화하는 단순한 웹 애플리케이션입니다.<br>
![](word-cloud.gif)

## Setup

Install dependencies

```sh
$ yarn install (or npm install)
```

## Development

```sh
$ yarn dev (or npm run dev)
# visit http://localhost:8080
```

## Features

바닐라 자바스크립트로 만든 텍스트 분석 웹 어플리케이션입니다. 주요 기능은 다음과 같습니다.

- 사용자가 5,000자 이하로 텍스트를 입력할 수 있습니다. (영문만 지원)
- 5000자를 초과했을 경우, 사용자에게 글자수 초과에 대한 정보를 알려주고 텍스트 분석은 하지 않습니다.
- 텍스트가 5000자를 초과하지 않았을 경우, 사용자에게 텍스트 분석 결과를 보여줍니다.
- 사용자가 텍스트를 수정할 경우, 수정하는 동시에 분석 결과에 반영됩니다.
- 사용자가 입력한 텍스트에서 사용된 **단어**를 추출해 분석합니다. 중복되는 경우는 하나로 처리합니다.
- View Change 버튼을 클릭하면, 여러 방식의 시각화된 정보를 볼 수 있습니다.
