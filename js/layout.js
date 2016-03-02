Doc(document).ready(function () {
    var _ = window._,
        alertify = window.alertify;

    var Layout, layout;

    var Messages = function () {
        this.correctList = [
            'Да!',
            'Правильно!',
            'Молодец!',
            'Отлично!',
            'Верно!',
            'Так держать!'
        ];

        this.wrongList = [
            'Неправильно',
            'Не сдавайтесь!',
            'Что-то не так'
        ];

        this.isReadyMessage = 'Готовы?';

        this.getRandomIndexInRange = function (min, max) {
            return Math.ceil( Math.random() * (max - min) + min );
        };

        this.getIsReadyMessage = function () {
            return this.isReadyMessage;
        };

        this.getSuccessMessage = function () {
            var list = this.correctList,
                index = Math.floor(Math.random()*list.length);

            return list[index];
        };

        this.getErrorMessage = function () {
            var list = this.wrongList,
                index = Math.floor(Math.random()*list.length);

            return list[index];
        };
    };

    Layout = function () {
        var messages = new Messages();

        this.messages = messages;

        this.tonic = false;
        this.tonics = [];

        this.correctCount = 0;
        this.wrongCount = 0;
        this.scores = 0;

        this.timeLimit = 60;
        this.timeLeft = this.timeLimit;
        this.timer = false;

        this.startTime = 0;
        this.totalTime = 0;
        this.averageTime = 0;

        alertify.set({ delay: 2000 });

        var _this = this;
        var view = this;

        Doc('.b-sign-type .btn').on('click', function () {
            Doc('.b-sign-type .btn').removeClass('btn-info');
            Doc(this).addClass('btn-info');
        });

        Doc('.b-signs-count .btn').on('click', function () {
            Doc('.b-signs-count .btn').removeClass('btn-info');
            Doc(this).addClass('btn-info');
        });
        Doc('.filters-lad .btn-group .btn').on('click', function () {
            Doc('.filters-lad .btn-group .btn').removeClass('btn-info');
            Doc(this).addClass('btn-info');
        });
        Doc('.filters-count .btn-group .btn').on('click', function () {
            Doc('.filters-count .btn-group .btn').removeClass('btn-info');
            Doc(this).addClass('btn-info');
        });

        Doc('.btn-info').on('click', function () {
            _this.resetInputs();
        });

        Doc('.controls .start').on('click', function () {
            Doc('.controls .start').toggleClass('hidden');
            Doc('.controls .stop').toggleClass('hidden');
            Doc('.descr').hide();
            Doc('.game').show();

            alertify.success(messages.getIsReadyMessage());

            _this.nextQuestion();
        });

        Doc('.controls .stop').on('click', function () {
            _this.stopTimer();
            Doc('.controls .start').toggleClass('hidden');
            Doc('.controls .stop').toggleClass('hidden');

            Doc('.game').hide();
            Doc('.descr').show();
        });

        Doc('.check_tonic').on('click', function() {
            _this.checkAnswer();
        });

        this.notes = new window.Notes();

    };

    Layout.prototype.resetInputs = function(type) {
        Doc('.b-sign-type .btn').removeClass('btn-info');
        Doc('.b-signs-count .btn').removeClass('btn-info');
        Doc('.b-sign-type .btn')[0].addClass('btn-info');
    };

    Layout.prototype.getRandomMessage = function(type) {
        if (type === 'success') {
            this.messages.getCorrectMessage();
        } else {
            this.messages.getErrorMessage();
        }
    };

    Layout.prototype.stopTimer = function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = false;
        }
        this.timeLeft = this.timeLimit;
        Doc('.time').text(this.timeLimit);
    };

    Layout.prototype.startTimer = function() {
        var _this = this;
        if (this.timer) {
            Doc('.time').removeClass('wrong');
            clearInterval(_this.timer);
            this.timeLeft = this.timeLimit;
        }

        Doc('.time').removeClass('wrong').text(this.timeLimit);
        this.timer = setInterval(function() {
            _this.timeLeft = _this.timeLeft-1;
            if (_this.timeLeft <= 0) {
                _this.timeOut();
            }
            _this.updateTimer();
        }, 1000);
        this.startTime = +new Date();
    };

    Layout.prototype.getLad = function() {
        return Doc('.filters-lad .btn-info')[0].attr('data-value') || false;
    };
    Layout.prototype.getMaxSignsCount = function() {
        return +(Doc('.filters-count .btn-info')[0].attr('data-value')) || 7;
    };

    Layout.prototype.updateTimer = function() {
        Doc('.time').text(this.timeLeft);
    };
    Layout.prototype.timeOut = function() {
        clearInterval(this.timer);
        Doc('.time').addClass('wrong').text('0');
        this.onTimeOut();
    };

    Layout.prototype.generateNote = function(alias) {
        var tonics = [],
            filters;

        if (alias) {
            tonics = this.notes.getTonic(alias);
        } else {
            filters = {
                lad: this.getLad(),
                maxSignsCount: this.getMaxSignsCount()
            };
            tonics = this.notes.getRandomTonic(filters);
        }
        if (tonics.length) {
            this.tonics = tonics;
            this.tonic = _.first(tonics);
        } else {
            this.tonic = false;
            this.tonics = [];
            console.error('Incorrect tonic', alias);
        }
        return this.tonic;
    };

    Layout.prototype.drawNote = function() {
        Doc('.b-note .mus').text(this.tonic.alias);
        Doc('.b-note .lang').text(this.tonic.lang.ru);
    };

    Layout.prototype.updateScores = function() {
        Doc('.correctCount').text(this.correctCount);
        Doc('.wrongCount').text(this.wrongCount);
        Doc('.scores').text(this.scores);
    };

    Layout.prototype.updateAverageTime = function() {
        this.averageTime = this.totalTime / this.correctCount;
        var averageSeconds = Math.floor(this.averageTime / 1000);
        Doc('.averageTime').text(averageSeconds + ' с');
    };

    Layout.prototype.onCorrect = function() {
        if (this.timer) {
            this.stopTimer();
            this.totalTime += +new Date() - this.startTime;
            this.scores++;
            this.correctCount++;

            alertify.success(this.messages.getSuccessMessage());

            this.updateAverageTime();
            this.nextQuestion();
        }
    };

    Layout.prototype.onWrong = function() {
        if (this.timer) {
            alertify.error(this.messages.getErrorMessage());
            this.scores--;
            this.wrongCount++;
            this.updateScores();
        }
    };

    Layout.prototype.onTimeOut = function() {
        if (this.timer) {
            this.stopTimer();
            alertify.error('Time out!');
            this.scores--;
            this.nextQuestion();
        }
    };

    Layout.prototype.nextQuestion = function(alias) {
        this.resetInputs();

        Array.prototype.forEach.call(Doc('.controls .btn'), function(el, i){
            el.attr('disabled', 'disabled');
        });

        Doc('.b-note .mus')[0].text('...');
        Doc('.b-note .lang')[0].text('');
        var _this = this;
        this.updateScores();
        setTimeout(function () {
            _this.generateNote(alias);
            _this.drawNote();
            _this.startTimer();
            Doc('.controls .btn').removeAttr('disabled');
        }, 2000);
    };

    Layout.prototype.checkAnswer = function() {
        var _this = this;
        var correct = true;
        var sign = Doc('.b-sign-type .btn-info')[0].attr('data-value');

        if (this.tonic.sign !== sign) {
            correct = false;
        }

        var count = 0;
        if (sign) {
            count = Doc('.b-signs-count .btn-info')[0].attr('data-value');
        }

        if (this.tonic.signs !== +count) {
            correct = false;
        }

        if (correct) {
            this.onCorrect();
        } else {
            this.onWrong();
        }
    };

    layout = new Layout();

});
