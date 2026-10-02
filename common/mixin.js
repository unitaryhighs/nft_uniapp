function v(a, b) {
	return +((1000 * a - 1000 * b) / 1000).toFixed(1)
}
module.exports = {
	created() {
		if (this._setTransform) {
			this._setTransform = (x, y, scale, source = '', r, o) => {
				if (!(x !== null && x.toString() !== 'NaN' && typeof x === 'number')) {
					x = this._translateX || 0
				}
				if (!(y !== null && y.toString() !== 'NaN' && typeof y === 'number')) {
					y = this._translateY || 0
				}
				x = Number(x.toFixed(1))
				y = Number(y.toFixed(1))
				scale = Number(scale.toFixed(1))
				if (!(this._translateX === x && this._translateY === y)) {
					if (!r) {
						this.$trigger('change', {}, {
							x: v(x, this._scaleOffset.x),
							y: v(y, this._scaleOffset.y),
							source: source
						})
					}
				}
				if (!this.scale) {
					scale = this._scale
				}
				scale = this._adjustScale(scale)
				scale = +scale.toFixed(3)
				if (o && scale !== this._scale) {
					this.$trigger('scale', {}, {
						x: x,
						y: y,
						scale: scale
					})
				}
				var transform = 'translateX(' + x + 'px) translateY(' + y + 'px) scale(' + scale + ')'
				this.$el.style.transform = transform
				this.$el.style.webkitTransform = transform
				this._translateX = x
				this._translateY = y
				this._scale = scale
			}
		}
	},
	destroyed() {
        //解决预览模式关闭后，和重复开关预览模式this._setTransform函数无限次执行导致手机卡顿的问题
		if (this._FA) {
			this._FA.cancel()
		}
		if (this._SFA) {
			this._SFA.cancel()
		}
	},
	methods: {
	}
}