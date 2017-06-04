        const p = document.querySelector('p');
        const sanitize = (v) => {
                    // alert(v)
                    if (v > 59) return 59;
                    if (v < 0) return 1;
                    if (!v) return pomodoro.pomodoroWorking ? 25 : 5;
                    return v;
                };
        let eventHub = new Vue()

        let pomodoro = new Vue({
            el: '#ring-content',
            data: {
                minute: 25,
                second: 0,
                pomodoroWorking: true,
                timestamp: 0,
                started: false,
                state: '',
                rings: [document.getElementById('rings'), document.getElementById('ring-content'),document.getElementById('first-ring'), document.getElementById('second-ring'), document.getElementById('third-ring')]
            },
            computed: {
                min: function () { 
                        return this.minute < 10 ? '0' + this.minute : this.minute
                    },
                sec: function() {
                    return this.second < 10 ? '0' + this.second : this.second
                    },
                type: function(){ 
                    return this.pomodoroWorking ? 'WORK!' : 'REST!'
                },
                typeColor: function() {
                    return `color: ${this.pomodoroWorking ? '#6689BF' : '#EEAA78'}`;
                }
            },
            methods: {
                start: function() {
                    if(!this.started) {
                        this.started = true
                        this.state = ''
                        this.rings.forEach(v => {v.style.animationPlayState="running";})
                        this._tick();
                        this.interval = setInterval(this._tick, 1000);
                    }
                    else {
                        this.pause()
                    }
                },
                _tick(){
                    if(this.started) {
                        if(this.second) {
                            return this.second--;
                        }
                        if(this.minute){
                            this.second = 59;
                            return this.minute--;
                        }
                        this.switchState();
                        this.reset();
                     }
                },
                pause: function() {
                    this.started = false
                    this.state = 'paused'
                    this.rings.forEach(v => {v.style.animationPlayState="paused"})
                    clearInterval(this.interval)
                },
                reset: function() {
                        // alert('called', control.work)
                        if(this.pomodoroWorking){
                            this.minute = sanitize(+control.work)
                        } else {
                            this.minute = sanitize(+control.rest)
                        }
                },
                switchState: function () {
                    // p.classList.add('slide-out-top')
                    // setTimeout(() => {
                    //     p.classList.remove('slide-out-top')
                    //     p.classList.add('slide-in-bottom')
                    //     setTimeout(() => p.classList.remove('slide-in-bottom'), 1000)
                    // },500)
                    this.pomodoroWorking = this.pomodoroWorking? false: true;
                },
                test: () => console.log("TEST")
            },
            mounted () {
                eventHub.$on('rest', (data) => {
                    //console.log('RECEIVED REST'); 
                    if(!this.pomodoroWorking) {
                        this.minute = data; 
                        this.second = 0; 
                        this.pause();
                    } 
                    //alert(this.minute)
                })
                eventHub.$on('work', (data) => {
                    //console.log('RECEIVED WORK'); 
                    if(this.pomodoroWorking) {
                        this.minute = data; 
                        this.second = 0; 
                        this.pause();
                    }
                    //alert(this.minute)
                }),
                eventHub.$on('reset', () => {
                    this.pause()
                    this.reset()
                    this.second = 0
                }),
                eventHub.$on('switchState', () => {
                    this.pause()
                    this.switchState()
                    this.reset()
                    this.second = 0
                })
            }
        });

        let control = new Vue({
            el: '#control',
            data: {
                work: '',
                rest: ''
            },
            methods: {
                restChange: function () { eventHub.$emit('rest', sanitize(+this.rest));},
                workChange: function () { eventHub.$emit('work', sanitize(+this.work));},
                reset: function() { eventHub.$emit('reset')},
                switchState: function() { eventHub.$emit('switchState')}
            },
            computed: {
                state: () => pomodoro.pomodoroWorking ? "WORK" : "REST",
                nextState: () => !pomodoro.pomodoroWorking ? "WORK" : "REST"
            }
            // mounted() {
            //     this.work = 1;
            //     this.rest = 1;
            // }
        });
