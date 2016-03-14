(function () {
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

    window.Messages = Messages;
})();
