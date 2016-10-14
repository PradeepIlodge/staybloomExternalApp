
staybloomExternalApp.directive('ngShortcut', [
    '$parse',
    'shortcuts',
    function($parse, shortcuts){
      return {
        restrict: 'A',
        link: function(scope, element, attrs){
          var shortcutKeySets = scope.$eval(attrs.ngShortcut);
          if(_.isUndefined(shortcutKeySets)){
            return;
          }
          shortcutKeySets = shortcutKeySets.split('|');
          
          var action = _.ignore;
          var eventAction = function(event){
            return function(){
              element.trigger(event);
            };
          };

      var isSet = function(scope, expr){
        if(_.isUndefined(expr)){
          return false;
        }
        if(expr === ''){
          return true;
        }
        return scope.$eval(expr);
      };

          if(isSet(scope, attrs.ngShortcutClick)){
            action = eventAction('click');
          }
          else if(isSet(scope, attrs.ngShortcutFocus)){
            action = eventAction('focus');
          }
          else if(isSet(scope, attrs.ngShortcutFastClick)){
            // Since we are just triggering (not binding)
            // this works just fine.
            action = eventAction('click'); 
          }
          else if(attrs.ngShortcutNavigate){
            var url = scope.$eval(attrs.ngShortcutNavigate);
            action = function(){
              navigation.redirect(url, true);
            };
          }
          else if(attrs.ngShortcutAction){
            var fn = $parse(attrs.ngShortcutAction);
            action = function(){
              scope.$apply(function(){
                fn(scope);
              });
            };
          }
          
          _.forEach(shortcutKeySets, function(keySet){
            var shortcut = shortcuts.register({
              keySet: keySet,
              action: action,
              description: attrs.ngShortcutDescription || ''
            });
            scope.$on("$destroy", function(){
              shortcuts.unregister(shortcut);
            });
          });
        }
      }
    }
  ]);
