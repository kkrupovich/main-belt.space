import { mapState } from "vuex";
import utils from '../../utils'

let interval = null

export default {
  data(){
    return {
      vestingReady: false,
    }    
  },
  computed: {
    ...mapState({
      player: state => state.userProfile.player,
    }),
    showVesting() {
      return this.player && this.player.levelresult === 4 ? (utils.assetAmount(this.player.vestingbalance) > 0) : false
    },
    vestingDate() {
      return this.player && this.showVesting ? this.player.resulttimestamp*1000 : null
    }
  },
  created() {
    this.initVestingInterval()
  },
  destroyed() {
    clearInterval(interval)
  },
  watch: {
    vestingDate(n, o) {
      if (!n)
        clearInterval(interval)
      else
        this.initVestingInterval()
    }
  },
  methods: {
    initVestingInterval() {
        const now = Date.now()
        const vesting = this.vestingDate
        if (vesting && vesting > now) {
          this.vestingReady = false
          const diff = vesting - now
          interval = setInterval(() => {
            this.vestingDateReached()
          }, diff)
        } else if (vesting && vesting < now) {
          this.vestingReady = true
        } else {
          this.vestingReady = false
          clearInterval(interval)
        }
      }
    },
    vestingDateReached() {
      this.vestingReady = true
      clearInterval(interval)      
    }
  }