export const JsonPatchDescription = `
In the preceding JSON:
1. The 'op' property indicates the type of operation. \n
2. The 'path' property indicates the element to update. \n
3. The 'value' property provides the new value. - The *TYPE* of 'value' depends on the *TYPE* of the element in 'path'\n\n

*For Example: If TYPE of element in path: '/isProvider' is 'boolean' , then The TYPE of Value should be 'boolean'*   \n\n

op can be 'add' , 'replace' or 'remove'    \n
1. add : Add a property or array element. For existing property: set value. \n
2. remove : Remove a property or array element. \n
3. replace : Same as remove followed by add at same location. \n

In the preceding JSON, the following validations are applied to the fields:
1. The 'title' field is mandatory.
2. 'content' field is mandatory.
`;

