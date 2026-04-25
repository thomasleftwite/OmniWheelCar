# オムニホイール・カーのリモートコントロール実装ガイド

DF-Robot DFR0548 モータードライバーを使用した、Mecanum/Omniホイール・カーの送信機（リモコン）と受信機（車体）のプログラムを作成しました。

## 1. システム構成

- **送信機 (Remote Controller)**:
  - micro:bit の内蔵加速度センサ（IMU）を使用して、傾き（ピッチ/ロール）を移動コマンドに変換します。
  - A/Bボタンで車体の旋回（スピン）を制御します。
  - 無線（Radio）経由で `x`（横移動）、`y`（前後移動）、`r`（旋回）の値を送信します。

- **受信機 (Receiver - Car side)**:
  - 無線で受信した値をもとに、Mecanumホイールの運動学（Kinematics）計算を行い、4つのモーター速度を決定します。
  - DFR0548 (DF-Driver) を I2C 経由で制御します。

## 2. ファイル構成

- [controller.ts](file:///home/saeki/src/antigravity/microbit/ominiWheelCar/controller.ts): 送信機用コード
- [receiver.ts](file:///home/saeki/src/antigravity/microbit/ominiWheelCar/receiver.ts): 受信機用コード

## 3. 使い方

### MakeCode への導入手順
1. [MakeCode for micro:bit](https://makecode.microbit.org/) を開きます。
2. 新しいプロジェクトを作成します。
3. **拡張機能 (Extensions)** で `https://github.com/DFRobot/pxt-motor` を検索して追加します。
4. エディタ上部の「JavaScript」タブを選択し、作成したコードを貼り付けます。

### 操作方法
- **前進/後退**: micro:bit を前後に傾けます。
- **左右スライド**: micro:bit を左右に傾けます。
- **旋回**: Aボタンで左旋回、Bボタンで右旋回します。
- **緊急停止**: 送信機をシェイク（振る）すると、停止コマンドを送信します。

## 4. 運動学ロジック (Mecanum Kinematics)

受信機側では以下の式で各モーターの速度を計算しています：
- **左前 (M1)** = y + x + r
- **右前 (M2)** = y - x - r
- **左後 (M3)** = y - x + r
- **右後 (M4)** = y + x - r

これにより、全方向へのスムーズな移動が可能になります。
