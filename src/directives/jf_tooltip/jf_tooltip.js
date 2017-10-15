export function jfTooltip($sanitize) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
	        let content = $sanitize($attrs.jfTooltip);
	        $($element).tooltipster({
                animation: 'fade',
                contentAsHTML : 'true',
                trigger: 'hover',
                onlyOne: 'true',
                interactive: 'true',
                position: 'bottom',
                theme: 'tooltipster-default bottom',
                content: content
            });

            $attrs.$observe('jfTooltip', function(val){
                if (val === '') val = null;
                $($element).tooltipster('content', val);
            });
        }
    }
}