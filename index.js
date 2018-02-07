var webdriver = require('selenium-webdriver');
by = webdriver.By,
promise = require('promise');
settings = require('./settings'),
log4js = require('log4js');

log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});

var logger = log4js.getLooper('cheese');
//logger.level = 'debug';

var browser = new webdriver
	.Builder()
	.withCapabilities(webdriver.Capabilities.phantomjs());
browser.manage().window().setSize(800, 600);
browser.
browser.get('https://www.instagram.com/accounts/login/');
browser.findElement(by.name('username').sendKeys(setting.bot_login));
browser.findElement(by.name('password').sendKeys(setting.bot_password))
//browser.findElement(by.xpath('.//*[id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[1]/div/div[1]/input')).sendKeys(settings.bot_login);
//browser.findElement(by.name('.//*[id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[2]/div/div[1]/input')).sendKeys(settings.bot_pass);  
browser.findElement(by.xpath('//button')).click();
console.log('Logged In!');
//logger.info('Logged In!');
var xpath_first_photo = '//*[@id="react-root"]/section/main/article/div[1]/div/div[1]/div[1]';
////*[@id="react-root"]/section/main/article/div[1]/div/div[1]/div[1]'
var xpath_like_class = '/html/body/div[4]/div/div[2]/div/article/div[2]/section[1]/a[1]';
var xpath_like_button = '/html/body/div[4]/div/div[2]/div/article/div[2]/section[1]/a[1]/span';
var xpath_next_button = '/html/body/div[2]/div/div[1]/div/div/a';

function like_by_nickname(indexNickname){
	if (indexNickname >= settings.accounts_for_likes.length) {
		console.log('All done!');
		//logger.info('ALl done!');
		browser.quit();
		return;
	}
	var promise = new Promise(function(resolve, reject){
		browser.sleep(settings.sleep_delay);
		console.log("Doing likes for: " + settings.accounts_for_likes[indexNickname] );
		//logger.info("Doing likes for: " + settings.accounts_for_likes[indexNickname] );
		browser.get('https://www.instagram.com/' + settings.accounts_for_likes[indexNickname]);//[]
		browser.sleep(settings.sleep_delay);
		browser.findElement(by.xpath(xpath_first_photo)).click().then(function(){
			like(resolve, 0, settings.likes_per_user);
		})
	});
};
promise.then(function(){
	indexNickname++;
	like_by_nickname(indexNickname);
});

function like(resolve, index, max_likes){
	browser.getCurrentUrl().then(function(url){
		console.log("Current Url" + classname);
		//logger.info("Current Url" + classname);
		if ( (classname.indexOf('coreSpriteHeartFull') > 0) ) {  
			console.log("Already liked. Stopping...")
			//logger.info("Already liked. Stopping...")
			resolve();
			return;
		} else {
			if ( (classname.indexOf('coreSpriteHeartOpen') > 0) ){  
			browser.findElement(by.path(xpath_like_button)).click();
			browser.sleep(settings.sleep_delay);
			browser.findElement(by.path(xpath_next_button)).then(function(buttons){
				console.log("Buttons" + buttons.length + "Photo index: " + index);
				//logger.info("Buttons" + buttons.length + "Photo index: " + index);
				if ((index == 0) && (buttons.length == 1) || (buttons == 2)) {
					buttons[buttons.length - 1].click().then(function(){
						index++;
						if (index == max_likes) {
							resolve();
							return;
						}
						like(resolve, index, max_likes);
					});
				} else {
					console.log("Next button does not exist. Stopping.")
					//logger.info("Next button does not exist. Stopping.")
					resolve();
					return;
				}
			})
			}
		}
	})
}
