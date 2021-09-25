/*	AsyncQueue.js
	FPI, 2021-09-18
	*/

class AsyncQueue {
  
	/* delayBetween: delay (ms) before calling next item
		*/
  constructor( delayBetween) {
		this.queue = [];
		this.id = 0;
		if (delayBetween < 1) {
			delayBetween = 1;
		}
		this.delayBetween = delayBetween;
		this.timer = null;
    // setInterval( this.resolveNext.bind(this), this.delayBetween);
  }
	
  add(fn, param) {
    return new Promise( resolve => {
			// liste inversée : le dernier élément ajouté est au début du tableau
			this.id ++;
			param.queueId = this.id;
			// console.log( `${new Date().yyyymmddhhmmsslll()} > push request: ${JSON.stringify(param)}`);
      this.queue.unshift( { fn, param, resolve } );
			// console.log( `${new Date().yyyymmddhhmmsslll()} > add() > setTimeout...`);
			if (this.timer == null) {
				this.timer = setTimeout( this.resolveNext.bind(this), this.delayBetween);
			}
    });
  }
	
  resolveNext() {
		this.timer = null;
		// console.log( `${new Date().yyyymmddhhmmsslll()} > resolveNext() > called, len: ${this.queue.length}...`);
    if ( ! this.queue.length) return;		
    const { fn, param, resolve } = this.queue.pop();
		// console.log( `${new Date().yyyymmddhhmmsslll()} > pop request: ${JSON.stringify(param)}`);
		// execute fn, and call resolve only when finished
    // fn(param).then(resolve);
    fn(param).then( (result) => {
			// console.log( `${new Date().yyyymmddhhmmsslll()} > fn resolved: ${JSON.stringify(result)}`);
			if (this.timer == null) {
				this.timer = setTimeout( this.resolveNext.bind(this), this.delayBetween);
			}
		});
  }
}

module.exports = AsyncQueue;
