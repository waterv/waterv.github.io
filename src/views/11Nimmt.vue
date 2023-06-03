<template>
  <div class="eleven-nimmt">
    <v-expand-transition>
      <v-card v-show="!connected" class="elevation-2">
        <v-card-text>
          <v-text-field
            v-model="server"
            prepend-icon="mdi-server"
            :label="$t('_.server')"
            clearable
          />
          <v-text-field
            v-model="port"
            prepend-icon="mdi-serial-port"
            hide-details
            :label="$t('_.port')"
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="connect">
            {{ $t('_.connect') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>

    <v-expand-transition>
      <tutorial-list v-show="!connected" :tutorials="tutorials" />
    </v-expand-transition>

    <v-expand-transition>
      <v-card v-show="connected && !logged" class="elevation-2">
        <v-card-text>
          <v-text-field
            v-model="id"
            prepend-icon="mdi-identifier"
            :label="$t('_.id')"
            clearable
          />
          <v-text-field
            v-model="nickname"
            prepend-icon="mdi-account"
            hide-details
            :label="$t('_.nickname')"
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="register">
            {{ $t('_.register') }}
          </v-btn>
          <v-btn color="primary" text @click="login()">
            {{ $t('_.login') }}
          </v-btn>
          <v-btn text @click="connected = false">
            {{ $t('_.back') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>

    <v-expand-transition>
      <v-card v-show="logged && started" class="mb-4 elevation-2">
        <v-card-title>
          {{ $t('nimmt.pile') }}
          <v-chip small class="ml-2" @click="showHint = !showHint">
            <v-icon v-text="'mdi-chess-queen'" small />
            <template v-if="showHint">
              {{ $t('nimmt.hints.pile') }}
            </template>
            {{ freeBull }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <nimmt-pile
            v-for="(v, i) in piles"
            :key="i"
            :value="v.top"
            :depth="v.num"
            :disabled="turn != player.no"
            :selected="selectedPile == i"
            @click="togglePile(i)"
          />
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <v-expand-transition>
      <v-card v-show="logged && started" class="mb-4 elevation-2">
        <v-card-title>
          {{ $t('nimmt.hand') }}
          <v-chip small class="ml-2" @click="showHint = !showHint">
            <v-icon v-text="'mdi-cards'" small />
            <template v-if="showHint">
              {{ $t('nimmt.hints.hand[0]') }}
            </template>
            {{ player.hand.length }}
            <v-icon v-text="'mdi-chess-queen'" small />
            <template v-if="showHint">
              {{ $t('nimmt.hints.hand[1]') }}
            </template>
            {{ player.bull }}
            <v-icon v-text="'mdi-cow'" small />
            <template v-if="showHint">
              {{ $t('nimmt.hints.hand[2]') }}
            </template>
            {{ score }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <nimmt-pile
            v-for="(v, i) in player.hand"
            :key="i"
            :value="v"
            :depth="1"
            :disabled="!canPushCard(selectedPile, v)"
            :selected="selectedCards[v] !== undefined"
            @click="toggleCard(selectedPile, v)"
          />
          <nimmt-pile
            :value="-1"
            :depth="1"
            :selected="isPickPile"
            @click="pickPile()"
          />
        </v-card-text>
        <v-card-actions v-show="turn == player.no">
          <v-btn color="primary" text @click="action">
            {{ $t('nimmt.next') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>

    <v-expand-transition>
      <v-card v-show="logged" class="elevation-2">
        <v-card-title>
          {{ $t('_.players') }}
          <v-chip v-if="round !== undefined" small class="ml-2">
            {{ $t('nimmt.round', [round]) }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <template v-if="round !== undefined && showHint">
            {{ $t('nimmt.hints.players') }}
          </template>
          <v-radio-group v-model="targetNo" row>
            <v-radio
              v-for="(v, i) in players"
              :key="i"
              :value="i"
              :disabled="!started || !targetsNo.includes(i)"
            >
              <template v-slot:label>
                <v-chip
                  class="my-1 mr-2"
                  :color="
                    (!started && v.ready) || (started && turn == i)
                      ? 'primary'
                      : ''
                  "
                >
                  {{ v.nickname }}
                  <template v-if="round !== undefined">
                    <v-icon v-text="'mdi-cards'" small />
                    {{ v.handNum }}
                    <v-icon v-text="'mdi-chess-queen'" small />
                    {{ v.bull }}
                    <v-icon v-text="'mdi-cow'" small />
                    {{ v.head }}
                  </template>
                </v-chip>
              </template>
            </v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions v-show="!started">
          <v-btn
            :loading="readying"
            :disabled="readying"
            color="primary"
            text
            @click="setReady"
          >
            {{ ready ? $t('_.unready') : $t('_.ready') }}
          </v-btn>
          <v-btn color="red" text @click="logout">
            {{ $t('_.logout') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>

    <v-snackbar v-model="snackbar" class="safe-bottom">
      {{ snackbarTip }}
    </v-snackbar>
  </div>
</template>

<script>
import TutorialList from '@/components/TutorialList.vue'
import NimmtPile from '@/components/NimmtPile.vue'

let nimmt = require('@/data/nimmt.json')
const STATE = nimmt.states

export default {
  name: 'ElevenNimmt',
  components: { TutorialList, NimmtPile },
  data: that => ({
    snackbar: false,
    snackbarTip: '',
    showHint: true,

    server: 'localhost',
    port: '1234',
    id: ('0000' + Math.floor(Math.random() * 10000).toString()).slice(-4),
    nickname: that.$t('_.defaultNickname'),

    ws: undefined,

    connected: false,
    logged: false,
    ready: false,
    readying: false,
    started: false,

    turn: undefined,
    round: undefined,
    freeBull: undefined,
    players: [],
    piles: [],
    player: { no: undefined, hand: [], bull: 0 },

    selectedPile: undefined,
    selectedCards: {},
    isPickPile: false,
    targetNo: undefined,
    diff: {},

    tutorials: nimmt.tutorials,
  }),
  computed: {
    score() {
      return this.player.hand.reduce(
        (prev, curr) => prev + this.scoreOfCard(curr),
        0
      )
    },
    maxBull() {
      return Math.max(...this.players.map(player => player.bull)) || 0
    },
    targetsNo() {
      return this.players
        .map((v, i) => ({ no: i, bull: v.bull }))
        .filter(
          ({ no, bull }) =>
            (bull == this.maxBull || this.player.bull == this.maxBull) &&
            no != this.player.no
        )
        .map(v => v.no)
    },
  },
  watch: {
    turn() {
      this.selectedPile = undefined
      this.selectedCards = {}
      this.isPickPile = false
    },
    targetsNo(v) {
      this.targetNo = v[0]
    },
    diff(v) {
      if (!v) return
      let res = this.$t('nimmt.diffHints[0]', [
        this.players[v.playerNo].nickname,
      ])
      if (v.pileDecNo != -1) {
        res += this.$t('nimmt.diffHints[1]', [v.pileDecNo + 1])
        if (v.bullDiff)
          res += this.$t('nimmt.diffHints[2]', [
            this.freeBull
              ? this.$t('nimmt.diffHints[3]')
              : this.$t('nimmt.diffHints[4]', [
                  this.players[v.targetNo].nickname,
                ]),
            v.bullDiff,
          ])
      } else {
        res += this.$t('nimmt.diffHints[5]', [
          v.pilesInc.map(i => i.no + 1).join(this.$t('nimmt.diffHints[6]')),
          v.pilesInc.length > 1 ? this.$t('nimmt.diffHints[7]') : '',
          v.pilesInc.map(i => i.num).join(this.$t('nimmt.diffHints[6]')),
        ])
      }
      this.snackbar = true
      this.snackbarTip = res + this.$t('nimmt.diffHints[8]')
    },
  },
  methods: {
    connect() {
      this.ws = new WebSocket(`ws://${this.server}:${this.port}/`)
      this.ws.onmessage = msg => {
        let data = JSON.parse(msg.data)

        if (data.no !== undefined) this.player.no = data.no
        if (
          data.state < 100 ||
          data.state == STATE.BROADCAST_GAME_START ||
          data.state == STATE.BROADCAST_GAME_END
        ) {
          this.snackbar = true
          this.snackbarTip = this.$t(`nimmt.error.${data.state}`)
        }

        switch (data.state) {
          case STATE.READY_FAIL_GAME_STARTED:
            this.readying = false
            break
          case STATE.CONNECT_SUCCESS:
            this.connected = true
            break
          case STATE.REGIS_SUCCESS:
            this.logged = true
            this.ready = false
            this.readying = false
            break
          case STATE.LOGIN_SUCCESS:
            Object.assign(this.player, data.player)
            this.logged = true
            this.readying = false
            this.started = data.started
            this.fetch()
            break
          case STATE.LOGOUT_SUCCESS:
            this.logged = false
            this.ready = false
            this.readying = false
            break
          case STATE.FETCH_SUCCESS:
            this.player = data.player
            break
          case STATE.BROADCAST_GAME_START:
          case STATE.BROADCAST_GAME_STATUS:
            Object.assign(this, data.data)
            this.diff = data.diff
            this.fetch()
            break
          case STATE.BROADCAST_GAME_END:
            this.ready = false
            Object.assign(this, data.data)
            this.fetch()
            break
          case STATE.BROADCAST_GAME_BASIC:
            Object.assign(this, data.data)
            if (this.players[this.player.no].ready != this.ready) {
              this.ready = !this.ready
              this.readying = false
            }
            break
        }
      }
    },
    register() {
      let { id, nickname } = this
      this.ws.send(JSON.stringify({ operation: 'register', id, nickname }))
    },
    login() {
      let { id } = this
      this.ws.send(JSON.stringify({ operation: 'login', id }))
    },
    setReady() {
      let { id, ready } = this
      this.ws.send(JSON.stringify({ operation: 'ready', id, state: !ready }))
      this.readying = true
    },
    logout() {
      let { id } = this
      this.ws.send(JSON.stringify({ operation: 'logout', id }))
    },
    fetch() {
      let { id } = this
      this.ws.send(JSON.stringify({ operation: 'fetch', id }))
    },
    scoreOfCard(card) {
      const primes = [
        2, 5, 7, 11, 17, 19, 29, 31, 37, 41, 47, 59, 61, 67, 71, 79, 89, 97,
      ]
      if ((card - 3) % 30 == 0) return 7
      if ((card - 3) % 10 == 0) return 5
      if (primes.includes(card)) return 3
      return 1
    },
    togglePile(i) {
      if (this.turn != this.player.no) return
      this.selectedPile = this.selectedPile === i ? undefined : i
    },
    canPushCard(i, v) {
      if (i === undefined) return true
      if (this.selectedCards[v] === i) return true
      if (this.isPickPile) return false

      let sCards = Object.keys(this.selectedCards).filter(
        v => this.selectedCards[v] !== undefined
      )
      let sPiles = [
        ...new Set(
          Object.values(this.selectedCards).filter(i => i !== undefined)
        ),
      ]

      if (this.player.bull == 0 && sCards.length == 1) return false
      if (!sPiles.includes(i) && Math.max(this.player.bull, 1) == sPiles.length)
        return false

      let pileTop = this.piles[i].top
      if (pileTop <= 90) return pileTop < v && v <= pileTop + 10
      return pileTop < v || v <= pileTop - 90
    },
    toggleCard(i, v) {
      if (i === undefined) return
      if (!this.canPushCard(i, v)) return
      this.isPickPile = false
      delete this.selectedCards[0]
      this.selectedCards[v] = this.selectedCards[v] === i ? undefined : i
      this.$forceUpdate()
    },
    pickPile() {
      if (!this.isPickPile) {
        this.isPickPile = true
        this.selectedCards = { 0: this.selectedPile }
      } else {
        this.isPickPile = false
        delete this.selectedCards[0]
      }
    },
    action() {
      let { id, targetNo } = this
      let data
      if (!this.isPickPile) {
        let originData = {}
        for (let v of Object.keys(this.selectedCards)) {
          let i = this.selectedCards[v]
          if (i === undefined) continue
          if (!originData[i]) originData[i] = []
          originData[i].push(v)
        }
        data = Object.keys(originData).map(i => ({
          pileNo: Number(i),
          cards: originData[i].map(v => Number(v)),
        }))
      } else {
        data = [{ pileNo: this.selectedCards[0], cards: [] }]
      }
      if (data.length == 0) {
        this.snackbar = true
        this.snackbarTip = this.$t(
          `nimmt.error[${STATE.ACT_LOCAL_FAIL_NO_ACTION}]`
        )
        return
      }
      this.ws.send(JSON.stringify({ operation: 'action', id, data, targetNo }))
    },
  },
}
</script>
