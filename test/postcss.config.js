const postcss = require('postcss')
module.exports = {
    plugins: {
        'postcss-sprites': {
            // 文档：https://www.npmjs.com/package/postcss-sprites
            spritePath: './src/images/',
            stylesheetPath: './src/css',
            verbose: false,

            // image的路径或者名字中含有sprite关键词的进行合并，否则不合并
            filterBy(image) {
                if (/sprites/.test(image.url)) {
                    return Promise.resolve()
                }
                return Promise.reject()
            },

            spritesmith: {
                // 文档：https://github.com/twolfson/spritesmith
                algorithm: 'left-right',
            },

            // 雪碧图分组，当图片较多的时候使用，通过判断路径和名字中的关键词，resolve不同的名字，reject的为默认名字
            groupBy(image) {
                const arr = image.url.split('/')
                const groupName =
                    arr[arr.length >= 2 ? arr.length - 2 : 'common']
                return Promise.resolve(groupName)
            },
            hooks: {
                onUpdateRule: (rule, token, image) => {
                    let backgroundSizeX =
                        (image.spriteWidth / image.coords.width) * 100
                    let backgroundSizeY =
                        (image.spriteHeight / image.coords.height) * 100
                    let backgroundPositionX =
                        (image.coords.x /
                            (image.spriteWidth - image.coords.width)) *
                        100
                    let backgroundPositionY =
                        (image.coords.y /
                            (image.spriteHeight - image.coords.height)) *
                        100

                    backgroundSizeX = isNaN(backgroundSizeX)
                        ? 0
                        : backgroundSizeX
                    backgroundSizeY = isNaN(backgroundSizeY)
                        ? 0
                        : backgroundSizeY
                    backgroundPositionX = isNaN(backgroundPositionX)
                        ? 0
                        : backgroundPositionX
                    backgroundPositionY = isNaN(backgroundPositionY)
                        ? 0
                        : backgroundPositionY

                    const backgroundImage = postcss.decl({
                        prop: 'background-image',
                        value: 'url(' + image.spriteUrl + ')',
                    })

                    const backgroundSize = postcss.decl({
                        prop: 'background-size',
                        value: backgroundSizeX + '% ' + backgroundSizeY + '%',
                    })

                    const backgroundPosition = postcss.decl({
                        prop: 'background-position',
                        value:
                            backgroundPositionX +
                            '% ' +
                            backgroundPositionY +
                            '%',
                    })

                    rule.insertAfter(token, backgroundImage)
                    rule.insertAfter(backgroundImage, backgroundPosition)
                    rule.insertAfter(backgroundPosition, backgroundSize)
                },
            },
        },
        tailwindcss: {
            content: ['./src/**/*.{html,js}']
        },
    },
}
