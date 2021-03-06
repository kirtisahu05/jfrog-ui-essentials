class jfMarqueeController {
	/* @ngInject */
    constructor($element,$timeout,$interval,$scope,$transclude) {
        this.$timeout = $timeout;
        this.$transclude = $transclude;
        this.container = $($element).find('.jf-marquee-container');
        this.content = $($element).find('.jf-marquee-container span');

        this.container.on('mouseenter',()=>this.onMouseEnter());
        this.container.on('mouseleave',()=>this.onMouseLeave());
    }
    onMouseEnter() {
        if (this.disabled) return;
        this.checkOverflow();
        if (this.overflowing) {
            this.animPeriod = (this.content.innerWidth() * 0.01);
            this.startAnimation(1000);
        }
    }
    onMouseLeave() {
        if (this.disabled) return;
        if (this.overflowing) {
            this.content.css('transition','none');
            this.content.css('left','0');
            this.container.removeClass('animating')
            if (this.startAnimTimeout) this.$timeout.cancel(this.startAnimTimeout);
            if (this.loopAnimTimeout) this.$timeout.cancel(this.loopAnimTimeout);
        }
    }

    startAnimation(delay = 0) {
        this.container.addClass('animating')
        this.content.css('transition',`left ${this.animPeriod}s linear`);
        this.content.css('left','0');
        this.startAnimTimeout = this.$timeout(()=>{
            this.content.css('left',(-this.content.innerWidth())+'px');
            this.loopAnimTimeout = this.$timeout(() => {
                this.content.css('transition','none');
                this.content.css('left',this.container.innerWidth()+'px');
                this.animPeriod = ((this.container.innerWidth() + this.content.innerWidth()) * 0.01);

                this.$timeout(()=>this.startAnimation(),10);
            },this.animPeriod*1000);
        }, delay);
    }
    checkOverflow() {
        if (Math.round(this.container.innerWidth()) < Math.round(this.container[0].scrollWidth)) {
            this.container.addClass('overflowing');
            this.overflowing = true;
        }
        else {
            this.container.removeClass('overflowing');
            this.overflowing = false;
        }
    }
}

export function jfMarquee() {
    return {
        restrict: 'E',
        transclude: {
            innerHtml: '?innerHtml',
        },
        scope: {
            disabled: '=?'
        },
        controller: jfMarqueeController,
        controllerAs: 'jfMarquee',
        bindToController: true,
        templateUrl: 'directives/jf_marquee/jf_marquee.html'
    }
}