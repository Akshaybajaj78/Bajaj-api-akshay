const { processHierarchies } = require('./utils/graphProcessor');

const payload = {
  "data": [
    "A->B", "A->C", "B->D", "C->E", "E->F",
    "X->Y", "Y->Z", "Z->X",
    "P->Q", "Q->R",
    "G->H", "G->H", "G->I",
    "hello", "1->2", "A->"
  ]
};

const result = processHierarchies(payload.data);
console.log(JSON.stringify(result, null, 2));
