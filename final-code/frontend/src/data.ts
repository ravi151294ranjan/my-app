export interface TreeNode {
  id: string;
  title: string;
  type: string,
  children: TreeNode[];
  isExpanded?:boolean;
}

export interface DropInfo {
    targetId: string;
    action?: string;
}

export var demoData: TreeNode[] = [
  {
    id: '',
    title: '',
    type: 'sop',
    children:[]
  },
  {
    id: '',
    title: '',
    type: 'sop',
    children:[
      {
        id: '',
        title: '',
        type: 'sop',
        children:[]
      },
        {
        id: '',
        title: '',
        type: 'sop',
        children:[]
      },
        {
        id: '',
        title: '',
        type: 'sop',
        children:[]
      }
    ]
  },
  {
    id: '',
    title: '',
    type: 'sop',
    children:[]
  }
]