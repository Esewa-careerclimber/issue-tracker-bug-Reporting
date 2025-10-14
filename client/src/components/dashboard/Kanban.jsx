import React from 'react';
import './Kanban.css';

const sample = {
  backlog:[{id:1,title:'Auth flow refactor'},{id:2,title:'Rate limit spike'}],
  todo:[{id:3,title:'Improve logging middleware'}],
  progress:[{id:4,title:'Upgrade dependencies'},{id:5,title:'Dark mode polish'}],
  review:[{id:6,title:'Add unit tests'}],
  done:[{id:7,title:'Fix CORS issue'}]
};

const columns = [
  {key:'backlog', label:'Backlog'},
  {key:'todo', label:'To Do'},
  {key:'progress', label:'In Progress'},
  {key:'review', label:'Review'},
  {key:'done', label:'Done'},
];

export function Kanban(){
  return (
    <div className="kanbanWrap">
      {columns.map(col => (
        <div key={col.key} className="kanbanCol">
          <div className="colHead">{col.label} <span className="count">{sample[col.key].length}</span></div>
          <div className="colBody">
            {sample[col.key].map(i => (
              <div key={i.id} className="ticket">{i.title}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
