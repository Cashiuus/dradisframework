// TODO: think REST please!!!
// TODO: this should be an object, not functions

//------------------------------------------------------------------------ nodes
function addnode(node, callback) {
  var parent = node.parentNode;
  var p = { 
    label: node.text 
  };
  if (parent.id != 'root-node') {
    p.parent_id = parent.id
  }
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/node_create',
    params: p, 
    success: function(response, options) {
                   dradisstatus.setStatus({ 
                        text: 'New node sent to the server',
                        clear: 5000
                   });
              dradis.revision += 1; 
              callback(response.responseText);
    },
    failure: function(response, options) {
                   dradisstatus.setStatus({
                        text: 'An error occured with the Ajax request',
                        iconCls: 'error',
                        clear: 5000
                   });
    }
  });
}

function delnode(node, callback){
  var p = { id: node.id };
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/node_delete',
    params: p, 
    success: function(response, options) {
      dradisstatus.setStatus({ 
        text: 'Node removed from the server',
        clear: 5000
      });
      dradis.revision += 1; 
    },
    failure: function(response, options) {
      dradisstatus.setStatus({
        text: 'An error occured with the Ajax request',
        iconCls: 'error',
        clear: 5000
      });
    }
  });

}

function updatenode(node, callback){
  var p = { id: node.id, label: node.text };
  if (node.parentNode.parentNode !== null) {
    p.parent_id = node.parentNode.id;
  }
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/node_update',
    params: p, 
    success: function(response, options) {
      dradisstatus.setStatus({ 
        text: 'Node label edited',
        clear: 5000
      });
      dradis.revision += 1; 
    },
    failure: function(response, options) {
      dradisstatus.setStatus({
        text: 'An error occured with the Ajax request',
        iconCls: 'error',
        clear: 5000
      });
    }
  })

}

//------------------------------------------------------------------------ notes 
function addnote(note, callback) {
  var p = note.data;
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/note_create',
    params: p, 
    success: function(response, options) {
              dradisstatus.setStatus({ 
                text: 'New note sent to the server',
                clear: 5000
              });
              dradis.revision += 1; 
              callback(response.responseText);
    },
    failure: function(response, options) {
              dradisstatus.setStatus({
                text: 'An error occured with the Ajax request',
                iconCls: 'error',
                clear: 5000
              });
    }
  })

}

function delnote(note, callback){
  var p = note.data; 
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/note_delete?id=' + note.id,
    params: p, 
    success: function(response, options) {
               dradisstatus.setStatus({ 
                 text: 'Note successfully deleted.',
                 clear: 5000
               });
              dradis.revision += 1; 
    },
    failure: function(response, options) {
              dradisstatus.setStatus({
                text: 'An error occured with the Ajax request',
                iconCls: 'error',
                clear: 5000
              });
    }
  })

}

function updatenote(note, callback){
  var p = note.data;
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/note_update?id='+note.id,
    params: p, 
    success: function(response, options) {
      dradisstatus.setStatus({ 
        text: 'Data sent to the server',
        clear: 5000
      });
      dradis.revision += 1; 
    },
    failure: function(response, options) {
      dradisstatus.setStatus({
        text: 'An error occured with the Ajax request',
        iconCls: 'error',
        clear: 5000
      });
    }
  })
}

//------------------------------------------------------------------------ categories 
function addcategory(category, callback) {
  var p = category.data; 
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/category_create',
    params: p, 
    success: function(response, options) {
              dradisstatus.setStatus({ 
                text: 'New category sent to the server',
                clear: 5000
              });
              dradis.revision += 1; 
              callback(response.responseText);
    },
    failure: function(response, options) {
              dradisstatus.setStatus({
                text: 'An error occured with the Ajax request',
                iconCls: 'error',
                clear: 5000
              });
    }
  })


}

function delcategory(category, callback) {
  var p = category.data; 
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/category_delete',
    params: p, 
    success: function(response, options) {
              var msg = response.responseText;
              if (msg == 'noerror') {
                dradisstatus.setStatus({ 
                  text: 'Category successfully deleted.',
                  clear: 5000
                });
                dradis.revision += 1; 
              } else {
                dradisstatus.setStatus({
                  text: msg,
                  //iconCls: 'error',
                  clear: 10000
                });

              }
              // callback even if an error existed: restore the DS
              callback(msg);
    },
    failure: function(response, options) {
              dradisstatus.setStatus({
                text: 'An error occured with the Ajax request',
                iconCls: 'error',
                clear: 5000
              });
    }
  })
}

function updatecategory(category, callback){
  var p = category.data; 
  p.authenticity_token = dradis.token;
  Ext.Ajax.request({
    url: '/json/category_update',
    params: p, 
    success: function(response, options) {
              var msg = response.responseText;
              if (msg == 'noerror') {
                dradisstatus.setStatus({ 
                  text: 'Category successfully updated.',
                  clear: 5000
                });
                dradis.revision += 1; 
              } else {
                dradisstatus.setStatus({
                  text: msg,
                  //iconCls: 'error',
                  clear: 10000
                });

              }
              // callback even if an error existed: restore the DS
              callback(msg);
    },
    failure: function(response, options) {
              dradisstatus.setStatus({
                text: 'An error occured with the Ajax request',
                iconCls: 'error',
                clear: 5000
              });
    }
  })
 
}


//------------------------------------------------------------------------ revision poller

function checkrevision() {
  // prevent further requests
  // this may be better done with Ext's TaskRunner
  if (dradis.revision == -1) { return; }

  Ext.Ajax.request({
    url: '/configurations/1.xml',
    method: 'get',
    success: function(response, options) {
              var msg = response.responseText;
              // how ugly is this?
              rev = msg.match(/<value>(.*)<\/value>/);
              if (dradis.revision != eval(rev[1])) {
                dradisstatus.setStatus({ 
                  text: 'There is a new revision in the server. Please refresh.',
                });
                // prevent further requests
                // this may be better done with Ext's TaskRunner
                dradis.revision = -1;
              }
    },
    failure: function(response, options) {
              dradisstatus.setStatus({
                text: 'An error occured with the Ajax request',
                iconCls: 'error',
                clear: 5000
              });
    }
  })

}
