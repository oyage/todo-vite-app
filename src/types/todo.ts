/**
 * TODOアイテムの構造を定義するインターフェース。
 * @property id - TODOアイテムの一意な識別子（文字列）。
 * @property text - TODOアイテムのテキスト内容（文字列）。
 * @property completed - TODOアイテムが完了したかどうかを示すブール値。
 */
export interface Todo {
  id: string;          // ID (一意な識別子)
  text: string;        // タスクの内容
  completed: boolean;  // 完了状態 (trueなら完了、falseなら未完了)
}
