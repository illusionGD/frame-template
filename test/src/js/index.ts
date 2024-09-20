import {
    setLocalItemWithExpire,
    getLocalItemWithExpire,
    getFormatDate,
    clearExpiredLocalStorage,
} from '@static-web/core'
import { charaters } from '../data/data.js'

$(function () {
    test1()
    async function test1() {
        const res = await test()
        console.log('🚀 ~ res:', res)
    }
    function test() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, 3000)
        })
    }

    const $officalBtn = $('#page1 .official-link')
    const $mark = $('#mark')
    const $player = $('#mark video')
    const $videoBtn1 = $('#page1-player-btn')
    const $videoBtn2 = $('#page2-player-btn')
    const $avatarList = $('.chartor-list') // 头像列表
    const $infoList = $('.chartor-info>img') // 角色信息列表
    let activeIndex = 0

    $avatarList.delegate('img', 'click', function () {
        changeCharater($(this).index())
    })
    // hover点亮头像
    $avatarList.children().each(function (index, item) {
        $(item).hover(
            function () {
                $(this).attr('src', charaters[index].avatar_light)
            },
            function () {
                if (activeIndex !== index) {
                    $(this).attr('src', charaters[index].avatar)
                }
            }
        )
    })
    // cv的hover点亮
    $infoList.hover(
        function () {
            const item = $(this)
            const i = item.index()

            if (i === 2) {
                item.attr('src', charaters[activeIndex].chinaCV_light)
            } else if (i === 3) {
                item.attr('src', charaters[activeIndex].japanCV_light)
            }
        },
        function () {
            const item = $(this)
            const i = item.index()

            if (i === 2) {
                item.attr('src', charaters[activeIndex].chinaCV)
            } else if (i === 3) {
                item.attr('src', charaters[activeIndex].japanCV)
            }
        }
    )
    // 跳转官网
    $('#page1 .logo-text').click(jumpOffical)
    $officalBtn.click(jumpOffical)

    // 播放视频
    $videoBtn1.click(() => {
        $mark.css('display', 'flex')
        changeVideoUrl($player, './video/pv1.mp4')
    })
    $videoBtn2.click(() => {
        $mark.css('display', 'flex')
        changeVideoUrl($player, './video/pv2.mp4')
    })

    // 关闭播放页面
    $mark.click(() => {
        $mark.css('display', 'none')
        stopPlayer($player)
    })

    function jumpOffical() {
        window.location.href = 'https://ys.mihoyo.com/main/'
    }

    function stopPlayer(player) {
        player.trigger('pause')
    }

    function changeVideoUrl(player, url) {
        console.log(url)
        player.attr('src', url)
    }

    function changeCharater(index) {
        const $name = $('#charaterName')
        const $paint = $('#charaterPaint')
        // 头像亮度变化
        $avatarList
            .children()
            [activeIndex].setAttribute('src', charaters[index].avatar)
        activeIndex = index
        $avatarList
            .children()
            [index].setAttribute('src', charaters[index].avatar_light)
        // 立绘，名字变化
        $paint.attr('src', charaters[index].pinterUrl)
        $name.attr('src', charaters[index].name)
        $infoList[1].setAttribute('src', charaters[index].description)
        // cv变化
        $infoList[2].setAttribute('src', charaters[index].chinaCV)
        $infoList[3].setAttribute('src', charaters[index].japanCV)
    }
})
