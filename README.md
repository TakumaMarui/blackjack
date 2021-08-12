# アプリケーション名

Blackjack

# アプリケーション概要

トランプゲームのblackjackが遊べるアプリケーション。

# URL

https://blackjack-36091.herokuapp.com/

# テスト用アカウント

メールアドレス：test@com
パスワード：test11

# 利用方法

ログイン後、画面中央付近の「Start」ボタンを押すとゲームを開始できます。

# 目指した課題解決

老若男女問わず、自由時間に楽しく遊んでもらい、ストレスの解消といった課題の解決を目指しました。

# 洗い出した要件

・ユーザー管理機能
・blackjackページ表示機能
・ユーザー情報表示機能
・ユーザー情報編集機能
・ユーザー情報一覧表示機能
・ルールページ表示機能

# 実装した機能についての画像やGIFおよびその説明

## ユーザー管理機能
https://gyazo.com/65fbaf27745e684b920e836c1e454c2e
https://gyazo.com/949d26f7aa3b609714daa4676911b49a
nickname, email, password（必須）とimage, profileを登録することで新規登録ができる。また、email, passwordを入力するとログインができる。

## blackjackページ表示機能
https://gyazo.com/4fc2fc55bb222782c0d26a309633519a
賭け金を入力しStartボタンを押すとゲームが開始される。状況に応じて、Hit, Stand, Double, Surrenderそれぞれのボタンを押すことでゲームが進行し、勝敗が決定される。

## ユーザー情報表示機能
https://gyazo.com/e25d1be161514ee7fe30382f2ce095b5
ユーザー名をクリックするとユーザーの情報が確認できる。

## ユーザー情報編集機能
https://gyazo.com/de066e8371d52a411863d3458ef88cc7
編集ボタンをクリックするとユーザー編集ページに遷移し、image, profileを入力するとそれぞれの情報を編集できる。

## ユーザー情報一覧表示機能
https://gyazo.com/b093a7026ee8a4a3976577ace1ce7c18
ランキングボタンをクリックするとユーザー一覧表示ページに遷移する

## ルールページ表示機能
https://gyazo.com/994129597149606f196c50a83c731d75
ルールボタンをクリックするとルールページに遷移する

# データベース設計

## users テーブル

| Column              | Type    | Options                   |
| ------------------- | ------- | ------------------------- |
| nickname            | string  | null: false               |
| email               | string  | null: false               |
| encrypted_password  | string  | null: false               |
| coin                | integer | null: false, default: 100 |
| profile             | text    |                           |